import { isDebug } from '../extension';

export function showLog(message: any) {
  if (isDebug) {
    console.log(message);
  }
}
