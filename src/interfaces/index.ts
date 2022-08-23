export interface IRoute {
  name: string;
  component: () => void;
}
  
export type elementData = {
  [key: string] : string 
}

export const BASE_URL = "http://localhost:8081/";
