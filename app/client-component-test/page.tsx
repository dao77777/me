'use client'

import { InfiniteData, queryOptions, useInfiniteQuery, useMutation, useQueries, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { divide, set } from "lodash";
import { FC, ReactNode, useEffect, useRef, useState } from "react";

const getListByCursor = async (cursor: number, size: number) => {
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
  const targetData = data.slice(cursor + 1, cursor + size + 1);
  return await new Promise<Data[]>(resolve => setTimeout(() => resolve(targetData), 1000));
}

export default function ClientComponentTest() {
  const [isMount, setIsMount] = useState(false);

  return (
    <Navigator>
      <button
        className="bg-black hover:bg-gray-800 rounded-sm p-2 text-white cursor-pointer transition-all flex items-center justify-between"
        onClick={() => setIsMount(!isMount)}
      >
        <div className="text-sm text-gray-300 font-bold">Switch Component </div>
        <div className={`${isMount ? "text-green-400" : "text-red-400"} text-lg font-bold w-10`}>{isMount ? "On" : "Off"}</div>
      </button>
      <div className="w-[800px] flex gap-2">
        <div className="w-1/2 rounded-sm p-4 bg-gray-100 shadow">
          <QueryComponent />
        </div>
        <div className="w-1/2 rounded-sm p-4 bg-gray-100 shadow">
          {isMount ? <QueryComponent /> : <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-300">Unmounted</div>}
        </div>
      </div>
      <InfiniteQueryComponent />
    </Navigator>
  )
};

const Navigator: FC<{ children: ReactNode }> = ({ children }) => {
  const pages = [
    "CommonQuery",
    "InfiniteQuery",
    "Custom1",
    "Custom2",
    "Custom3",
    "Custom4",
    "Custom5",
    "Custom6",
  ];

  const [pointer, setPointer] = useState(0);
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

  const onPointerChange = (newPointer: number) => {
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
    setPointer(newPointer);
    onPointerChange(newPointer);
  }

  const onBackward = () => {
    const newPointer = (pointer + 1) % pages.length;
    setPointer(newPointer);
    onPointerChange(newPointer);
  }

  const onSpecificNavigate = (pointer: number) => {
    setPointer(pointer);
    onPointerChange(pointer);
  }

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-[1000px] h-full border-[1px]">
        {children}
      </div>
      <div className="absolute left-0 top-0 w-40 h-full border-r-[1px] shadow-lg border-gray-100 bg-gradient-to-r from-white to-white/0 flex flex-col items-center justify-center backdrop-blur-sm gap-2">
        {pages.map((page, idx) => (
          <div
            key={idx}
            className={`
              w-full py-2 text-center text-sm text-gray-400 hover:text-gray-400 hover:bg-gray-100 hover:animate-pulse cursor-pointer
              ${idx === pointer ? "underline font-bold text-xl text-gray-600" : ""}
              transition-all
            `}
            onClick={() => onSpecificNavigate(idx)}
          >{page}</div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-white/0 flex justify-center">
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
      <div className="w-5 h-5 rounded-full bg-amber-400 border-4 border-amber-200 shadow-lg shadow-amber-800 absolute bottom-5 right-5 cursor-pointer hover:animate-pulse hover:scale-150 transition-all"></div>
    </div>
  )
}

const InfiniteQueryComponent: FC = () => {
  const [isErrorQuery, setIsErrorQuery] = useState(false);
  const { data, error, status, fetchStatus, refetch, fetchPreviousPage, fetchNextPage } = useInfiniteQuery<
    { id: number, val: string }[],
    Error,
    InfiniteData<{ id: number, val: string }[], { cursor: number, size: number }>,
    string[],
    { cursor: number, size: number }
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
      return await getListByCursor(pageParam.cursor, pageParam.size);
    },
    initialPageParam: { cursor: 500, size: 10 },
    getNextPageParam: (lastPage, pages) => {
      return {
        cursor: lastPage[lastPage.length - 1].id,
        size: 10
      };
    },
  })

  console.log(data);

  return (
    <>
      <button
        className="relative shadow rounded-xs bg-black/90 hover:bg-gray-800/90 p-2 text-white flex flex-col items-start cursor-pointer transition-all"
      >
        <span className={`text-base font-bold ${isErrorQuery ? "text-amber-400/90" : "text-lime-400/90 text-shadow-xl text-shadow-lime-400"}`}>{isErrorQuery ? "Error Query" : "Common Query"}</span>
        <span
          className="
          absolute right-0 bottom-0 translate-1/2 
          text-xs text-gray-800/60 hover:text-gray-800/65 bg-white/60 hover:bg-white/65 border-[1px] border-gray-200/60 hover:border-gray-200/65 backdrop-blur-xs p-1 rounded-xs transition-all"
        >Switch</span>
      </button>
      <div>status: {status}</div>
      <div>fetchStatus: {fetchStatus}</div>
      <div className="w-60 rounded-sm border-[1px] p-2 h-52 overflow-auto">
        {data?.pages.map((page, i) => (
          <div key={i}>
            <div className="w-full h-2"></div>
            {`index: ${i}, cursor: ${data?.pageParams[i].cursor}`}
            <br />
            {
              page.map(item => (
                <div key={item.id}>{item.val}</div>
              ))
            }
            <div className="w-full h-2"></div>
            <hr />
          </div>
        ))}
        <div className="w-full h-2"></div>
        <div
          className="w-full text-center py-2 text-gray-400 hover:bg-gray-100 text-sm cursor-pointer transition-all"
          onClick={() => fetchNextPage()}
        >Load More</div>
      </div>
    </>
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
      {`data: ${data}`}
      <br />
      {`isPlaceholderData: ${isPlaceholderData}`}
      <br />
      {`dataUpdatedAt: ${dataUpdatedAt}`}
      <br />
      {`isStale: ${isStale}`}
      <br />
      {`error: ${error?.message ?? "no error"}`}
      <br />
      {`errorUpdatedAt: ${errorUpdatedAt}`}
      <br />
      {`errorUpdateCount: ${errorUpdateCount}`}
      <br />
      {`failureReason: ${failureReason?.message ?? "no failure"}`}
      <br />
      {`failureCount: ${failureCount}`}
      <br />
      {
        `status: ${status === "pending"
          ? "pending..."
          : status === "success"
            ? `success`
            : `error`}`
      }
      <br />
      {
        `isLoadingError: ${isLoadingError}`
      }
      <div className="w-full h-2"></div>
      <br />
      {
        `fetchStatus: ${fetchStatus === "fetching"
          ? "fetching..."
          : fetchStatus === "idle"
            ? "idle"
            : "paused"}`
      }
      <br />
      {
        `isLoading: ${isLoading}`
      }
      <br />
      {
        `isFetched: ${isFetched}`
      }
      <br />
      {
        `isFetchedAfterMount: ${isFetchedAfterMount}`
      }
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