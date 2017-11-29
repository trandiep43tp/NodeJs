var person={
	ho: "Tran",
	ten: "Diep",
	chaomung: function(){
		console.log("Chao mung " + this.ho +" " + this.ten);
	}
}

person.chaomung();

console.log(person["ten"]);