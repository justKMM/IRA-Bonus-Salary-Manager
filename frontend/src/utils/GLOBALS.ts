import { SalesManInterface } from '../app/interfaces/salesman-interface';

let seniorSalesMen: SalesManInterface[] = [];

const getSeniorSalesMen = (): SalesManInterface[] => seniorSalesMen;

const setSeniorSalesMen = (updatedSeniorSalesMen: SalesManInterface[]): void => {
    seniorSalesMen = updatedSeniorSalesMen;
};

export {
    getSeniorSalesMen,
    setSeniorSalesMen
};
