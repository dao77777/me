'use client'

/**
 * rxjs test
 */

import { useEffect } from "react";
import { Observable } from "rxjs";

export const RXJsTest = () => {
  useEffect(() => {
    const observerble = new Observable((subscriber) => {
      subscriber.next("hello");
      subscriber.next("world");
      subscriber.next(1);
      subscriber.next(2);
      setTimeout(() => {
        subscriber.next(3);
        subscriber.complete();
      }, 3000);
    })

    const subscriber = observerble.subscribe();

    const { promise, resolve, reject } = Promise.withResolvers()


    setTimeout(() => {
      observerble.subscribe({
        next: (val) => {
          console.log(val);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {

        }
      })
    }, 5000)

    return () => {
      observerble.subscribe().unsubscribe();
    }
  }, [])

  return (
    <div>

    </div>
  )
}