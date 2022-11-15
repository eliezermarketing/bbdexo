import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  allProduct = [];
  totalPrices: number;
  totalAmountProduct: number;
  shipping: number;
 

  constructor(public http: HttpClient) 
  {
    
  }

  ngOnInit() {

    let storedProducts = JSON.parse(localStorage.getItem("products"));


    if (!storedProducts?.length) {

      this.loadData();

    }

    else {

      this.allProduct = storedProducts;
      this.totalPrices = this.allProduct.map(product => product.amount * product.price).reduce((previousProd, nextProd) => (previousProd + nextProd), 0);
      this.totalAmountProduct = this.allProduct.map(product => (product.amount)).reduce((previousPrice, nextPrice) => (previousPrice + nextPrice), 0);
      this.shipping = this.totalAmountProduct >= 4 ? 120 : 20;

    }


  }

  async loadData() {

    let data = await this.http.get("https://fakestoreapi.com/products").toPromise() as any;


    this.allProduct = data.map(product => {
      return { ...product, amount: 0, };
    });

    this.totalPrices = 0;
    this.totalAmountProduct = 0;
    this.shipping = 20;
    this.setStorageProducts();

  }

  updateOrder() {

    this.totalPrices = this.allProduct.map(product => (product.amount * product.price)).reduce((previousPrice, nextPrice) => (previousPrice + nextPrice), 0);
    let newTotalProduct = this.allProduct.map(product => (product.amount)).reduce((previousPrice, nextPrice) => (previousPrice + nextPrice), 0);

    if (this.totalAmountProduct < 4 && newTotalProduct >= 4) {
      this.shipping = 120;

    }

    else if (this.totalAmountProduct >= 4 && newTotalProduct < 4) {
      this.shipping = 20;

    }

    this.totalAmountProduct = newTotalProduct;
    this.setStorageProducts();

  }

  deleteItem(product, index) {

    this.allProduct.splice(index, 1);

    this.totalAmountProduct = this.totalAmountProduct - product['amount'];

    this.totalPrices = this.totalPrices - (product['amount'] * product.price);

    if (this.totalAmountProduct >= 4) {

      this.shipping = 100;
    }

    else {

      this.shipping = 20;
    }

    this.setStorageProducts();

  }



  register() {

    alert('Your order has been successfully registered');

    this.loadData();

  }

  cancel() 
  {
    this.loadData();
  }



  setStorageProducts() {

    localStorage.setItem("products", JSON.stringify(this.allProduct));

  }




}
