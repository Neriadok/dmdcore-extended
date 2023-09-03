import { BehaviorSubject, Subject, skip, take } from "rxjs";

export function toPromise<T>(sub: Subject<T> | BehaviorSubject<T>, skipAmount: number = 0): Promise<T>{
    return new Promise((resolve) => sub.pipe(skip(skipAmount), take(1)).subscribe(resolve));
}