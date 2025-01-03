import { SalesManInterface } from '../app/interfaces/salesman-interface';

let seniorSalesMen: SalesManInterface[] = [];

const getSeniorSalesmen = (): SalesManInterface[] => seniorSalesMen;
/*
    Here I had to suppress some idiotic ES-Lint errors. Apparently I had to write everything in 1 line,
    but when I do that the length of the function is too long. Also enforced return type for lambda functions,
    even those from JavaScript library itself is just straight up retarded.
 */
// eslint-disable-next-line
const getSalesmanById = (id: number): SalesManInterface | undefined => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return getSeniorSalesmen().find(salesman => salesman.salesmanId === id);
};

const setSeniorSalesMen = (updatedSeniorSalesMen: SalesManInterface[]): void => {
    seniorSalesMen = updatedSeniorSalesMen;
};

export {
    getSeniorSalesmen,
    getSalesmanById,
    setSeniorSalesMen
};
