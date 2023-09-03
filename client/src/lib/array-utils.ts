export function moveInList<T>(list: Array<T>, startIndex: number, endIndex: number){
    const result = [...list];
    const [movedItem] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, movedItem);
    return result;
  };