import { HttpParams } from "@angular/common/http";

export const buildRequestParams = (params: { [key: string]: string | number }) => {
  let finalParams = new HttpParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      finalParams = finalParams.append(key, value.toString());
    }
  }
  return finalParams;
};
