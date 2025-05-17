'use client'

import { InfiniteData, queryOptions, useInfiniteQuery, useMutation, useQueries, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { divide, set } from "lodash";
import { FC, ReactNode, Suspense, use, useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function ClientComponentTest() {
  const pages = [
    "QueryTest",
    "PagenationQueryTest",
    "InfiniteQueryTest",
    "SuspenseTest",
    "Custom2",
    "Custom3",
    "Custom4",
    "Custom5",
    "Custom6",
  ];
  const [pointer, setPointer] = useState(0);

  return (
    <Navigator pages={pages} pointer={pointer} onPointerChange={setPointer}>
      {pages[pointer] === "QueryTest" && <QueryTest />}
      {pages[pointer] === "PagenationQueryTest" && <PagenationQueryTest />}
      {pages[pointer] === "InfiniteQueryTest" && <InfiniteQueryTest />}
      {pages[pointer] === "SuspenseTest" && <SuspenseTest />}
      <div className="w-full h-40"></div>
    </Navigator>
  )
};

const Navigator: FC<{ children: ReactNode, pages: string[], pointer: number, onPointerChange: (pointer: number) => void }> = ({ children, pages, pointer, onPointerChange }) => {
  const [lPages, setLPages] = useState([
    { idx: Math.random().toString(36).slice(2, 9), pointer: (pointer + pages.length - 2) % pages.length, active: false },
    { idx: Math.random().toString(36).slice(2, 9), pointer: (pointer + pages.length - 1) % pages.length, active: true },
    { idx: Math.random().toString(36).slice(2, 9), pointer: (pointer) % pages.length, active: false },
  ]);
  const lPageActiveIdx = lPages.findIndex(i => i.active);
  const [rPages, setRPages] = useState([
    { idx: Math.random().toString(36).slice(2, 9), pointer: pointer, active: false },
    { idx: Math.random().toString(36).slice(2, 9), pointer: (pointer + 1) % pages.length, active: true },
    { idx: Math.random().toString(36).slice(2, 9), pointer: (pointer + 2) % pages.length, active: false },
  ]);
  const rPageActiveIdx = rPages.findIndex(i => i.active);
  const animateTimeoutIdRef = useRef<null | NodeJS.Timeout>(null);

  const onPointerChangeEvent = (newPointer: number) => {
    animateTimeoutIdRef.current && clearTimeout(animateTimeoutIdRef.current);
    const prevPointer = (newPointer - 1 + pages.length) % pages.length;
    const nextPointer = (newPointer + 1) % pages.length;
    const newLPages = [...lPages].map(i => ({ ...i, active: i.pointer === prevPointer }));
    const newRPages = [...rPages].map(i => ({ ...i, active: i.pointer === nextPointer }));
    if (prevPointer === lPages[0].pointer) newLPages.unshift({ idx: Math.random().toString(36).slice(2, 9), pointer: (newLPages[0].pointer - 1 + pages.length) % pages.length, active: false });
    if (prevPointer === lPages[lPages.length - 1].pointer) newLPages.push({ idx: Math.random().toString(36).slice(2, 9), pointer: (newLPages[newLPages.length - 1].pointer + 1) % pages.length, active: false });
    if (nextPointer === newRPages[0].pointer) newRPages.unshift({ idx: Math.random().toString(36).slice(2, 9), pointer: (newRPages[0].pointer - 1 + pages.length) % pages.length, active: false });
    if (nextPointer === newRPages[newRPages.length - 1].pointer) newRPages.push({ idx: Math.random().toString(36).slice(2, 9), pointer: (newRPages[newRPages.length - 1].pointer + 1) % pages.length, active: false });
    if (!lPages.find(page => page.pointer === prevPointer) || !rPages.find(page => page.pointer === nextPointer)) {
      setLPages([(prevPointer - 1 + pages.length) % pages.length, prevPointer, (prevPointer + 1) % pages.length].map(pointer => ({
        idx: Math.random().toString(36).slice(2, 9),
        pointer,
        active: pointer === prevPointer
      })));
      setRPages([(nextPointer - 1 + pages.length) % pages.length, nextPointer, (nextPointer + 1) % pages.length].map(pointer => ({
        idx: Math.random().toString(36).slice(2, 9),
        pointer,
        active: pointer === nextPointer
      })));
      return;
    }
    setLPages(newLPages);
    setRPages(newRPages);
    animateTimeoutIdRef.current = setTimeout(() => {
      setLPages(lPages => {
        const activeIdx = lPages.findIndex(i => i.active);
        return lPages.filter((lPage, idx) => Math.abs(idx - activeIdx) <= 1);
      });
      setRPages(rPages => {
        const activeIdx = rPages.findIndex(i => i.active);
        return rPages.filter((rPage, idx) => Math.abs(idx - activeIdx) <= 1);
      });
    }, 300);
  }

  // console.log(lPages, lPageActiveIdx);

  const onForward = () => {
    const newPointer = (pointer - 1 + pages.length) % pages.length;
    onPointerChange(newPointer);
    onPointerChangeEvent(newPointer);
  }

  const onBackward = () => {
    const newPointer = (pointer + 1) % pages.length;
    onPointerChange(newPointer);
    onPointerChangeEvent(newPointer);
  }

  const onSpecificNavigate = (pointer: number) => {
    onPointerChange(pointer);
    onPointerChangeEvent(pointer);
  }

  const ref = useRef(new Map<number, HTMLElement>());
  const [sideBarWidth, setSideBarWidth] = useState(0);

  useEffect(() => {
    const maxWidth = ref.current.values().reduce((acc, el) => Math.max(el.getBoundingClientRect().width, acc), 0);
    setSideBarWidth(maxWidth);
  }, [pointer]);

  console.log("sideBarWidth", sideBarWidth);

  return (
    <div className="w-full">
      <div className="w-[1000px] min-h-screen m-auto border-x-[1px] border-gray-100/90">
        {children}
      </div>
      <div className="fixed left-0 top-0 w-60 h-full border-r-[1px] border-r-gray-100/90 shadow-md hover:shadow-lg hover:shadow-gray-200/90 shadow-gray-100/90 transition-all border-gray-100 bg-gradient-to-r from-white to-white/0 flex flex-col items-center justify-center backdrop-blur-sm gap-2">
        {pages.map((page, idx) => (
          <div
            key={idx}
            className={`
              w-full py-2 px-4 text-center text-sm text-gray-400 hover:text-gray-400 hover:bg-gray-100 hover:animate-pulse cursor-pointer
              ${idx === pointer ? "underline font-bold text-xl text-gray-600" : ""}
              transition-all
            `}
            onClick={() => onSpecificNavigate(idx)}
            ref={(el) => {
              ref.current.set(idx, el!);
              return () => { ref.current.delete(idx) };
            }}
          >{page}</div>
        ))}
        <div className="absolute left-0 top-0 w-full py-2 group flex flex-col items-center justify-center bg-black/0 hover:bg-black/90 rounded-xs transition-all duration-240 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-15 text-gray-600/90 drop-shadow drop-shadow-gray-600/90 group-hover:text-white/90 group-hover:drop-shadow-white/90 duration-1000"
          >
            <path d="
              M20,25
              a15,15 0 1,1 30,0
              a15,15 0 1,1 30,0
              a15,15 0 1,1 -30,0
              a15,15 0 1,1 -30,0
            "
            />
          </svg>
          <div className="text-gray-600/90 text-xs font-bold group-hover:text-white/90 text-shadow-lg text-shadow-gray-600/90 group-hover:text-shadow-white/90 transition-all duration-1000">Non-Infinite</div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-white/0 flex justify-center">
        <div className="w-[400px] flex items-center justify-between">
          <div className="group cursor-pointer flex flex-col items-end select-none" onClick={onForward}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            <div className="relative">
              {lPages.map((lPage, idx) => (
                <div
                  key={lPage.idx}
                  className={`
                    w-28 text-end text-gray-400 text-sm group-hover:underline group-hover:text-gray-600 transition-all overflow-hidden overflow-ellipsis
                    ${idx < lPageActiveIdx ? "absolute left-0 top-0 -z-10 opacity-0 -translate-x-8" : ""}
                    ${idx > lPageActiveIdx ? "absolute left-0 top-0 -z-10 opacity-0 translate-x-8" : ""}
                    ${idx === lPageActiveIdx ? "opacity-100 translate-x-0" : ""}
                    transition-all duration-300
                  `}
                >{pages[lPage.pointer]}</div>
              ))}
            </div>
          </div>
          <div className="group cursor-pointer flex flex-col items-start select-none" onClick={onBackward}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
            <div className="relative">
              {rPages.map((rPage, idx) => (
                <div
                  key={rPage.idx}
                  className={`
                  w-28 text-sm text-gray-400 group-hover:text-gray-600 group-hover:underline overflow-ellipsis overflow-hidden 
                  ${idx < rPageActiveIdx ? "absolute left-0 top-0 -z-10 opacity-0 -translate-x-8" : ""}
                  ${idx > rPageActiveIdx ? "absolute left-0 top-0 -z-10 opacity-0 translate-x-8" : ""}
                  ${idx === rPageActiveIdx ? "opacity-100 translate-x-0" : ""}
                  transition-all duration-300
                  `}
                >{pages[rPage.pointer]}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed w-5 h-5 rounded-full bg-amber-400 border-4 border-amber-200 shadow-lg shadow-amber-800 bottom-5 right-5 cursor-pointer hover:animate-pulse hover:scale-150 transition-all"></div>
    </div>
  )
}

const QueryTest = () => {
  const [isMount, setIsMount] = useState(false);

  return (
    <div className="box-border w-full p-4 flex flex-col items-start gap-4">
      <button
        className="bg-black hover:bg-gray-800 rounded-sm p-2 text-white cursor-pointer transition-all flex items-center justify-between"
        onClick={() => setIsMount(!isMount)}
      >
        <div className="text-sm text-gray-300 font-bold">Switch Component </div>
        <div className={`${isMount ? "text-green-400" : "text-red-400"} text-lg font-bold w-10`}>{isMount ? "On" : "Off"}</div>
      </button>
      <div className="w-full flex gap-2">
        <div className="w-1/2 rounded-sm p-4 bg-gray-100 shadow">
          <QueryComponent />
        </div>
        <div className="w-1/2 rounded-sm p-4 bg-gray-100 shadow">
          {isMount ? <QueryComponent /> : <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-300">Unmounted</div>}
        </div>
      </div>
    </div>
  )
}

const QueryComponent: FC = () => {
  const testQuery = queryOptions({
    queryKey: ["test"] as const,
    queryFn: async ({ queryKey }) => {
      const [key] = queryKey;
      return new Promise<number>(resolve => setTimeout(() => resolve(5), 2000));
    }
  })

  const test1Query = (val: number) => queryOptions({
    queryKey: ["test", { val }] as const,
    queryFn: async ({ queryKey }) => {
      const [key, { val }] = queryKey;
      return new Promise<number>(resolve => setTimeout(() => resolve(val), 5000));
    }
  })


  const test2Query = (isErrorQuery: boolean) => queryOptions({
    queryKey: ["test"],
    queryFn: async () => {
      return new Promise<string>((resolve, reject) => {
        // console.log("test2Query");
        setTimeout(() => {
          const randomChar = String.fromCharCode('a'.charCodeAt(0) + Math.floor(Math.random() * 26));
          if (isErrorQuery) {
            reject(new Error(`${randomChar}`));
          } else {
            resolve(`${randomChar}`)
          }
        }, 1000);
      })
    },
    // placeholderData: "placeholderData",
    // enabled: false,
    refetchInterval: 1000,
    staleTime: 5000,
  })

  const queryClient = useQueryClient();
  const [isErrorQuery, setIsErrorQuery] = useState(true);
  const {
    data,
    isPlaceholderData,
    isStale,
    dataUpdatedAt,
    error,
    errorUpdatedAt,
    errorUpdateCount,
    failureReason,
    failureCount,
    status,
    fetchStatus,
    isLoading,
    isLoadingError,
    isFetched,
    isFetchedAfterMount,
    isRefetching,
    isRefetchError,
    refetch
  } = useQuery(test2Query(isErrorQuery));
  const { mutate, variables } = useMutation({
    mutationKey: ["optimisitc"],
    mutationFn: async (val: number) => {
      await new Promise(resolve => setTimeout(() => resolve(val), 2000));
    }
  })

  return (
    <div className="text-gray-700">
      {`Data: ${data}`}
      <br />
      {`DataUpdatedAt: ${dataUpdatedAt}`}
      <br />
      {`IsPlaceholderData: ${isPlaceholderData}`}
      <br />
      {`IsStale: ${isStale}`}
      <br />
      {`ErrorUpdateCount: ${errorUpdateCount}`}
      <br />
      {`Error: ${error?.message ?? "no error"}`}
      <br />
      {`ErrorUpdatedAt: ${errorUpdatedAt}`}
      <br />
      {`IsLoadingError: ${isLoadingError}`}
      <br />
      {`IsRefetchError: ${isRefetchError}`}
      <br />
      {
        `Status: ${status === "pending"
          ? "pending..."
          : status === "success"
            ? `success`
            : `error`}`
      }
      <br />
      <div className="w-full h-1"></div>
      <br />
      {`IsFetched: ${isFetched}`}
      <br />
      {`IsFetchedAfterMount: ${isFetchedAfterMount}`}
      <br />
      {
        `FetchStatus: ${fetchStatus === "fetching"
          ? "fetching..."
          : fetchStatus === "idle"
            ? "idle"
            : "paused"}`
      }
      <br />
      {`IsLoading: ${isLoading}`}
      <br />
      {`IsRefetching: ${isRefetching}`}
      <div className="w-full h-1"></div>
      <br />
      {`FailureReason: ${failureReason?.message ?? "no failure"}`}
      <br />
      {`FailureCount: ${failureCount}`}
      <div className="w-full h-2"></div>
      <div className="flex gap-2">
        <button className="cursor-pointer bg-black hover:bg-gray-800 rounded-sm text-white p-2" onClick={() => refetch()}>refetch</button>
        <button
          className="cursor-pointer bg-black hover:bg-gray-800 rounded-sm p-2 text-white"
          onClick={() => setIsErrorQuery(!isErrorQuery)}
        >
          <span className="text-sm text-gray-300">Switch Query Mode</span>
          <span className={`${isErrorQuery ? "text-amber-400" : "text-lime-400"} text-lg`}>{isErrorQuery ? "ErrorQuery" : "CommonQuery"}</span>
        </button>
      </div>
      <div className="w-full h-2"></div>
    </div>
  )
}

const getPagenationQueryTestData = (page: number, size: number) => {
  type User = {
    id: string,
    name: string,
    address: string,
    phone: string,
    email: string
  }
  const ds: User[] = new Array(1000).fill(0).map((_, i) => {
    const rc1 = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    const rc2 = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    const rc3 = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    const rc4 = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    const id = Math.random().toString(36).slice(2, 9);
    return {
      id,
      name: rc1,
      address: rc2,
      phone: rc3,
      email: rc4,
    }
  });
  return new Promise<User[]>((resolve) => {
    setTimeout(() => {
      resolve(ds.slice((page - 1) * size, page * size));
    }, 500);
  });
}

const PagenationQueryTest: FC = () => {
  const [page, setPage] = useState(1);

  const {
    data, dataUpdatedAt, isStale, isPlaceholderData, errorUpdateCount, error, errorUpdatedAt, isLoadingError, isRefetchError, status,
    isFetched, isFetchedAfterMount, fetchStatus, isLoading, isRefetching,
    failureReason, failureCount
  } = useQuery({
    queryKey: ["pagenation", page] as const,
    queryFn: async ({ queryKey }) => {
      return getPagenationQueryTestData(queryKey[1], 0)
    },
    staleTime: 1000 * 60,
  })

  const [isLoadingShow, setIsLoadingShow] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoadingShow(true);
      }, 500)
    }
  }, [isLoading])

  return (
    <div className="w-full">
      <div className="p-4 w-full"><div className="relative group w-full shadow shadow-gray-100/90 rounded-xs border-[1px] border-gray-100/90 p-4 hover:shadow-lg hover:shadow-gray-200/90 transition-all bg-gradient-to-tl from-white/90 to-gray-200/90 from-80%">
        <div className={`absolute top-0 left-0 -translate-1/3 w-5 h-5 bg-gray-800/10 rotate-30 rounded-xs group-hover:rotate-90 transition-all`}>
          <div className={`absolute left-1/2 top-1/2 -translate-1/2 w-5 h-5 rounded-xs border-[0px] border-gray-800/0 ${fetchStatus === "fetching" && "border-[1px] animate-ping border-gray-800/90"}`}></div>
        </div>
        {/* <div className="absolute left-0 top-0 -translate-1/3 w-8 h-8 bg-gray-800/10 rounded-xs rotate-60 transition-all group-hover:rotate-0"></div> */}
        <div className="w-full flex justify-between text-gray-800/90 font-bold py-2 border-b-[1px] border-gray-400/90">
          <div className="w-40">Id</div>
          <div className="w-40">Name</div>
          <div className="w-40">Phone</div>
          <div className="w-40">Email</div>
          <div className="w-40">Address</div>
        </div>
        <div className="w-full h-4"></div>
        <div className="w-full h-100 relative">
          <div className={`w-full h-full flex flex-col justify-start ${isLoading ? "opacity-0" : "opacity-100"} transition-all duration-500`}>
            {data?.map(item => (
              <div key={item.id} className="w-full flex justify-between text-gray-600">
                <div className="w-40 h-10">{item.id}</div>
                <div className="w-40 h-10">{item.name}</div>
                <div className="w-40 h-10">{item.phone}</div>
                <div className="w-40 h-10">{item.email}</div>
                <div className="w-40 h-10">{item.address}</div>
              </div>
            ))}
            {data && data.length < 10 && data.length > 0 && <div className="w-full border-t-[1px] border-dashed border-gray-400/90 grow flex items-center justify-center text-xl text-gray-200/90 font-bold">No More Data</div>}
            {data && data.length === 0 && <div className="w-full h-full flex items-center justify-center text-xl text-gray-200/90 font-bold">No Content</div>}
          </div>
          {
            isLoadingShow && <div className={`absolute left-0 top-0 w-full h-100 flex items-center justify-center text-xl text-gray-200/90 font-bold ${isLoading ? "opacity-100" : "opacity-0"} transition-all duration-500`}>Loading...</div>
          }
        </div>
      </div></div>
    </div>
  )
}

const getListByCursor = async (cursor: number, size: number, direction: "forward" | "backward") => {
  console.log(`getListByCursor, cursor: ${cursor}, size: ${size}`);
  type Data = {
    id: number,
    val: string
  }
  const data: Data[] = new Array(1000).fill(0).map((_, i) => {
    const padIndex = i.toString().padStart(4, "0");
    const randomChar = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    return { id: i, val: `${padIndex}: ${randomChar}` };
  });
  const targetData = data.slice(direction === "forward" ? cursor + 1 : cursor - size, direction === "forward" ? cursor + size + 1 : cursor);
  return await new Promise<Data[]>(resolve => setTimeout(() => resolve(targetData), 500));
}

const InfiniteQueryTest: FC = () => {
  const [isErrorQuery, setIsErrorQuery] = useState(false);
  const {
    errorUpdateCount, data, dataUpdatedAt, isStale, isPlaceholderData, error, errorUpdatedAt, hasNextPage, hasPreviousPage, status, isFetchNextPageError, isFetchPreviousPageError, isLoadingError, isRefetchError,
    isFetched, isFetchedAfterMount, fetchStatus, isLoading, isRefetching, isFetchingNextPage, isFetchingPreviousPage,
    failureReason, failureCount,
    refetch, fetchPreviousPage, fetchNextPage
  } = useInfiniteQuery<
    { id: number, val: string }[],
    Error,
    InfiniteData<{ id: number, val: string }[], { cursor: number, size: number, direction: "forward" | "backward" }>,
    string[],
    { cursor: number, size: number, direction: "forward" | "backward" }
  >({
    queryKey: ["infinite"],
    queryFn: async ({ pageParam }) => {
      if (isErrorQuery) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error("Infinite Query Error"));
          }, 1000);
        })
      }
      return await getListByCursor(pageParam.cursor, pageParam.size, pageParam.direction);
    },
    initialPageParam: { cursor: 500, size: 10, direction: "forward" },
    getPreviousPageParam: (firstPage, pages) => {
      return {
        cursor: firstPage[0].id,
        direction: "backward",
        size: 10
      }
    },
    getNextPageParam: (lastPage, pages) => {
      return {
        cursor: lastPage[lastPage.length - 1].id,
        direction: "forward",
        size: 10,
      };
    },
    staleTime: 1000 * 60
  })

  const onScroll = () => {
    const isBottom = window.scrollY + window.innerHeight + 10 > document.documentElement.scrollHeight;
    console.log(`${isBottom}, ${!isFetchingNextPage}`);
    if (isBottom && !isFetchingNextPage) fetchNextPage();
  }
  const onScrollRef = useRef(onScroll); onScrollRef.current = onScroll;

  useEffect(() => {
    window.addEventListener("scroll", onScrollRef.current);
    return () => {
      window.removeEventListener("scroll", onScrollRef.current);
    }
  }, [])

  return (
    <div className="relative box-border w-full flex flex-col items-start gap-4">
      <div className="sticky z-10 top-0 left-0 w-full px-4 py-4 flex items-start justify-between backdrop-blur-sm bg-white/60 border-b-[1px] border-gray-200/60">
        <div className="w-40 flex flex-col items-start gap-4">
          <button
            className="border-[1px] border-gray-100/90 active:scale-95 shadow-md relative rounded-xs bg-white/90 hover:bg-gray-100/90 p-2 text-white flex flex-col items-start cursor-pointer transition-all"
            onClick={() => setIsErrorQuery(!isErrorQuery)}
          >
            <div className={`absolute left-0 top-0 w-[2px] h-full ${isErrorQuery ? "bg-amber-400" : "bg-lime-400"}`}></div>
            <div className={`absolute left-[2px] top-0 w-[2px] h-full ${isErrorQuery ? "bg-amber-200" : "bg-lime-200"}`}></div>
            <div className={`absolute left-[4px] top-0 w-[2px] h-full ${isErrorQuery ? "bg-amber-100" : "bg-lime-100"}`}></div>
            <span className={`text-base font-bold ${isErrorQuery ? "text-amber-400/90" : "text-lime-400/90"}`}>{isErrorQuery ? "Error Query" : "Common Query"}</span>
            <span
              className="
                absolute right-0 bottom-0 translate-1/2 
                text-xs text-gray-800/60 hover:text-gray-800/65 bg-white/60 hover:bg-white/65 border-[1px] border-gray-200/60 hover:border-gray-200/65 backdrop-blur-xs p-1 rounded-xs transition-all"
            >Switch</span>
          </button>
          <button
            className="relative shadow border-[1px] border-gray-100/90 p-2 text-gray-600/90 rounded-xs cursor-pointer font-bold transition-all bg-white/90 hover:bg-gray-100/90 active:scale-95"
            onClick={() => isFetchingPreviousPage || fetchPreviousPage()}
          >
            <div className="absolute left-0 top-0 w-[2px] h-full bg-gray-600/90"></div>
            <div className="absolute left-[2px] top-0 w-[2px] h-full bg-gray-400/90"></div>
            <div className="absolute left-[4px] top-0 w-[2px] h-full bg-gray-200/90"></div>
            {isFetchingPreviousPage ? "Fetching..." : "FetchPreviousPage"}
          </button>
          <button
            className="relative shadow border-[1px] border-gray-100/90 rounded-xs p-2 bg-white/90 text-gray-600 font-bold cursor-pointer hover:bg-gray-100/90 active:scale-95 transition-all"
            onClick={() => isFetchingNextPage || fetchNextPage()}
          >
            <div className="absolute left-0 top-0 w-[2px] h-full bg-gray-600/90"></div>
            <div className="absolute left-[2px] top-0 w-[2px] h-full bg-gray-400/90"></div>
            <div className="absolute left-[4px] top-0 w-[2px] h-full bg-gray-200/90"></div>
            {isFetchingNextPage ? "Fetching..." : "FetchNextPage"}
          </button>
          <button
            className="relative shadow border-[1px] border-gray-100/90 rounded-xs p-2 bg-white/90 text-gray-600 font-bold cursor-pointer hover:bg-gray-100/90 active:scale-95 transition-all"
            onClick={() => fetchStatus === "fetching" && !isFetchingPreviousPage && !isFetchingNextPage || refetch()}
          >
            <div className="absolute left-0 top-0 w-[2px] h-full bg-gray-600/90"></div>
            <div className="absolute left-[2px] top-0 w-[2px] h-full bg-gray-400/90"></div>
            <div className="absolute left-[4px] top-0 w-[2px] h-full bg-gray-200/90"></div>
            {fetchStatus === "fetching" && !isFetchingPreviousPage && !isFetchingNextPage ? "Fetching.." : "Fetch"}
          </button>
        </div>
        <div className="text-sm text-gray-400 w-52">
          {`DataUpdatedAt: ${dataUpdatedAt}`} <br />
          {`IsPlaceholderData: ${isPlaceholderData}`} <br />
          {`IsStale: ${isStale}`} <br />
          {`HasPreviousPage: ${hasPreviousPage}`} <br />
          {`HasNextPage: ${hasNextPage}`} <br />
          {`ErrorUpdateCount: ${errorUpdateCount}`} <br />
          {`Error: ${error?.message ?? "No Error"}`} <br />
          {`ErrorUpdatedAt: ${errorUpdatedAt}`} <br />
          {`IsLoadingError: ${isLoadingError}`} <br />
          {`IsRefetchError: ${isRefetchError}`} <br />
          {`IsFetchNextPageError: ${isFetchNextPageError}`} <br />
          {`IsFetchPreviousPageError: ${isFetchPreviousPageError}`} <br />
          {`Status: ${status}`} <br />
        </div>
        <div className="text-sm text-gray-400 w-52">
          {`IsFetched: ${isFetched}`} <br />
          {`IsFetchedAfterMount: ${isFetchedAfterMount}`} <br />
          {`FetchStatus: ${fetchStatus}`} <br />
          {`IsLoading: ${isLoading}`} <br />
          {`IsRefetching: ${isRefetching}`} <br />
          {`IsFetchingNextPage: ${isFetchingNextPage}`} <br />
          {`IsFetchingPreviousPage: ${isFetchingPreviousPage}`} <br />
        </div>
        <div className="text-sm text-gray-400 w-52">
          {`FailureReason: ${failureReason?.message ?? "No Failure"}`} <br />
          {`FailureCount: ${failureCount}`} <br />
        </div>
      </div>
      <div className="w-full px-4">
        <div className="relative z-0 group w-full rounded-xs border-[1px] border-gray-100/90 shadow shadow-gray-100/90 p-4 text-gray-600/90 hover:shadow-gray-200/90 hover:shadow-lg transition-all bg-gradient-to-tl from-white/90 to-gray-200/90 from-80%">
          <div className="absolute left-0 top-0 -translate-1/3 w-5 h-5 bg-gray-800/10 rotate-30 group-hover:rotate-90 transition-all"></div>
          <div className="w-full flex justify-between text-gray-800 font-bold border-b-[1px] border-gray-400 mb-4 py-2">
            <div className="w-40">Id</div>
            <div className="w-40">Value</div>
          </div>
          {data?.pages.map((page, i) => (
            <div className="relative z-0 flex flex-col gap-2" key={i}>
              <div className="absolute top-1/2 left-1/2 -translate-1/2 w-full text-gray-200/90 text-2xl font-bold flex justify-center gap-10">
                <span>{`Index: ${i}`}</span>
                <span>{`Cursor: ${data?.pageParams[i].cursor}`}</span>
                <span>{`Direction: ${data?.pageParams[i].direction}`}</span>
              </div>
              {
                page.map(item => (
                  <div key={item.id} className="w-full flex justify-between">
                    <div className="w-40">{item.id}</div>
                    <div className="w-40">{item.val}</div>
                  </div>
                ))
              }
              <div className="w-full h-2"></div>
              <div className="w-full h-[1px] bg-gray-100" />
              <div className="w-full h-2"></div>
            </div>
          ))}
          <div className="w-full h-2"></div>
          <div
            className="w-full text-center py-2 text-gray-400/90 hover:bg-gray-100/90 text-sm hover:animate-pulse cursor-pointer transition-all"
            onClick={() => fetchNextPage()}
          >{isFetchingNextPage || isLoading ? "Loading..." : "Load More"}</div>
        </div>
      </div>
    </div>
  )
}

const SuspenseComponent = () => {
  const [isSuspense, setIsSuspense] = useState(false);

  if (isSuspense) {
    throw new Promise(() => { });
  }

  const onClick = () => {
    setIsSuspense(true);
    setTimeout(() => {
      setIsSuspense(false);
    }, 2000);
  }

  const [asyncData, setAsyncData] = useState<Promise<string> | null>(null);

  const handleOnSendAsyncData = () => {
    setAsyncData(new Promise(resolve => { setTimeout(() => resolve(`This is Async Data, ${String.fromCharCode(Math.floor(Math.random() * 26) + 97)}`), 2000) }))
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="text-gray-600/90">Suspense Component</div>
      <button
        className="relative shadow shadow-gray-200/90 rounded-xs border-[1px] border-gray-100/90 p-2 bg-white/90 text-gray-600 font-bold cursor-pointer hover:bg-gray-100/90 active:scale-95"
        onClick={onClick}
      >
        <div className="absolute left-0 top-0 w-[2px] h-full bg-gray-600/90"></div>
        <div className="absolute left-[2px] top-0 w-[2px] h-full bg-gray-400/90"></div>
        <div className="absolute left-[4px] top-0 w-[2px] h-full bg-gray-200/90"></div>
        Click Me To Suspense
      </button>
      <button
        className="relative shadow shadow-gray-200/90 rounded-xs border-[1px] border-gray-100/90 p-2 bg-white/90 text-gray-600/90  font-bold hover:bg-gray-100/90 active:scale-95 transition-all cursor-pointer"
        onClick={handleOnSendAsyncData}
      >
        <div className="absolute left-0 top-0 w-[2px] h-full bg-gray-600/90"></div>
        <div className="absolute left-[2px] top-0 w-[2px] h-full bg-gray-400/90"></div>
        <div className="absolute left-[4px] top-0 w-[2px] h-full bg-gray-200/90"></div>
        Click Me To Send Async Data To Child Component
      </button>
      <Suspense fallback={<div className="text-gray-600/90">Child Loading...</div>}>
        <SuspenseChildComponent asyncData={asyncData} />
      </Suspense>
    </div>
  )
}

const SuspenseChildComponent: FC<{ asyncData: Promise<string> | null }> = ({ asyncData }) => {
  const data = asyncData ? use(asyncData) : "No Data";

  return (
    <div className="text-gray-600/90">
      <div>Suspense Child Component</div>
      <div>Async Data: {data}</div>
    </div>
  )
}

const SuspenseTest = () => {
  return (
    <div className="p-4">
      <Suspense fallback={<div className="text-gray-600/90">Loading...</div>}>
        <SuspenseComponent />
      </Suspense>
    </div>
  )
}
