import { SalesmanInterface } from '../app/interfaces/salesman-interface';

let seniorSalesMen: SalesmanInterface[] = [];

const getSeniorSalesmen = (): SalesmanInterface[] => seniorSalesMen;

const getSalesmanById = (salesmanId: number): SalesmanInterface | undefined =>
    getSeniorSalesmen().find((
        salesman: SalesmanInterface
    ): boolean => salesman.salesmanId === salesmanId
    );

const setSeniorSalesmen = (updatedSeniorSalesMen: SalesmanInterface[]): void => {
    seniorSalesMen = updatedSeniorSalesMen;
};

export {
    getSeniorSalesmen,
    getSalesmanById,
    setSeniorSalesmen
};
