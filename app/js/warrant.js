class Warrant{
    constructor(productName,totalWeight,storageRoomCode,warehouseAddress,products){
        this.productName = productName;
        this.totalWeight = totalWeight;
        this.storageRoomCode = storageRoomCode;
        this.warehouseAddress = warehouseAddress;
        this.products = products;
    }

}

class Product{

    constructor(sku,origin,specName,numberOfPieces,weight,unit){
        this.sku = sku;
        this.origin = origin;
        this.specName = specName;
        this.numberOfPieces = numberOfPieces;
        this.weight = weight;
        this.unit = unit;
    }
}