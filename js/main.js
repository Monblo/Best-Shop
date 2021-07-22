function Calculator(form, summary) {
    this.prices = {
        products: 0.5,
        orders: 0.25,
        package: {
            basic: 0,
            professional: 25,
            premium: 60
        },
        accounting: 35,
        terminal: 5
    };
    this.form = {
        products: form.querySelector("#products"),
        orders: form.querySelector("#orders"),
        package: form.querySelector("#package"),
        accounting: form.querySelector("#accounting"),
        terminal: form.querySelector("#terminal")
    };
    this.summary={
        list: summary.querySelector("ul"),
        items: summary.querySelector("ul").children,
        total: {
            container: summary.querySelector("#total-price"),
            price: summary.querySelector(".total__price")
        }
    };

    this.addEvents();
}

Calculator.prototype.updateSummary = function (id, calc, price, callback){
    const itemSummary = this.summary.list.querySelector("[data-id=" + id + "]");
    const itemCalc = itemSummary.querySelector(".item__calc");
    const itemPrice = itemSummary.querySelector(".item__price");

    itemSummary.classList.add("open");

    if (itemCalc !== null) {
        itemCalc.innerText = calc;}

    itemPrice.innerText = "$ " + price;

    if(typeof callback === "function"){
        callback(itemSummary,itemCalc, itemPrice)
    }
}

Calculator.prototype.inputEvent = function (e) {
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;
    const singlePrice = this.prices[id];
    const totalPrice = value * singlePrice;

    let calc1 = value + " * $" + singlePrice;

    this.updateSummary(id, calc1, totalPrice, function (item, calc, price){
        if(value < 0){
            calc.innerHTML = null;
            price.innerText = "Value should be grater then 0" }

        if(value.length === 0){
            item.classList.remove("open")}
    });

    this.updateTotal();
}

Calculator.prototype.selectEvent = function (e){
    this.form.package.classList.toggle("open");

    const value = typeof e.target.dataset.value !== "undefined" ? e.target.dataset.value : "";
    const text = typeof e.target.dataset.value !== "undefined" ? e.target.innerText : "Choose package";

    if (value.length > 0){
    this.form.package.querySelector(".select__input").innerText = text;
    const totalPrice = this.prices.package[value];
    this.form.package.dataset.value = value;

    this.updateSummary("package", text, totalPrice);}

    this.updateTotal();
}

Calculator.prototype.checkboxEvent = function (e){
    const checkbox = e.currentTarget
    const id = checkbox.id;
    const totalPrice = this.prices[id];

    this.updateSummary(id, undefined, totalPrice, function (item){
        if (!checkbox.checked){
            item.classList.remove("open")
        }
    });

    this.updateTotal();
}

Calculator.prototype.updateTotal = function (){
    const open = this.summary.list.querySelectorAll(".open").length > 0;
    const totalPrice = this.summary.total.price;

    if (open) {
        const products = this.form.products.value > 0 ? this.prices.products * this.form.products.value : 0;
        const orders = this.form.orders.value > 0 ? this.prices.orders * this.form.orders.value : 0;
        const packages = this.form.package.dataset.value.length !== 0 ? this.prices.package[this.form.package.dataset.value] : 0;
        const accounting = this.form.accounting.checked ? this.prices.accounting : 0;
        const terminal = this.form.terminal.checked ? this.prices.terminal : 0;
        totalPrice.innerText = "$ " + (products + orders + packages + accounting + terminal);

        this.summary.total.container.classList.add("open");
    } else {
        this.summary.total.container.classList.remove("open");
    }
}

Calculator.prototype.addEvents = function () {
    this.form.products.addEventListener("change", this.inputEvent.bind(this));
    this.form.products.addEventListener("keyup", this.inputEvent.bind(this));
    this.form.orders.addEventListener("change", this.inputEvent.bind(this));
    this.form.package.addEventListener("click", this.selectEvent.bind(this));
    this.form.accounting.addEventListener("change", this.checkboxEvent.bind(this));
    this.form.terminal.addEventListener("change", this.checkboxEvent.bind(this));
}


document.addEventListener("DOMContentLoaded", function () {
    const summary = document.querySelector(".calc__summary");
    const form = document.querySelector(".calc__form");

    new Calculator(form, summary);
});

