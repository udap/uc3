export class Warrant{

    constructor(warrantCode,productName,totalWeight,storageRoomCode,warehouseAddress,products){
        this.warrantCode = warrantCode;
        this.productName = productName;
        this.totalWeight = totalWeight;
        this.storageRoomCode = storageRoomCode;
        this.warehouseAddress = warehouseAddress;
        this.products = products;
    }

}

export class Product{

    constructor(sku,producedIn,specName,amount,weight,unit){
        this.sku = sku;
        this.producedIn = producedIn;
        this.specName = specName;
        this.amount = amount;
        this.weight = weight;
        this.unit = unit;
    }
}
