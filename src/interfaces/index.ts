export interface IRoute {
  name: string;
  component: (param: string) => void;
}
  
export type elementData = {
  [key: string] : string 
}

export const BASE_URL = "http://localhost:8081/";
