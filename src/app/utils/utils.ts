export default class Utils {
  static doSomething(val: string) {
    return val;
  }
  static doSomethingElse(val: string) {
    return val;
  }

  static sumoftwovalue(str1val: any, strval2: any) {
    var str1 = str1val;
    var str2 = strval2;
    
    if (str1.toString() === "0" && str2.toString() === "0") {
      return 0;
    } else {
      var twoPlacedFloat = parseFloat(
        str1.toString().replace(/,/g, "")
      ).toFixed(2);
      var twoPlacedFloat1 = parseFloat(
        str2.toString().replace(/,/g, "")
      ).toFixed(2);
      var total = Number(twoPlacedFloat) + Number(twoPlacedFloat1);
      var parts = total.toFixed(2).toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",");
      return parts.join(".");
    }
  }

  static convertIntoNumber(str1val: any) {
    if(str1val===undefined){
    return 0;
    }else{
     let v = str1val.toString().replace(/,/g, "");
    return Number(v);
    }
    
  }

  static converttocomaawithdecimal(str1val: any) {
    var str1 = str1val;
    if (str1===undefined || str1.toString() === "0") {
      return 0;
    } else {
      var twoPlacedFloat = parseFloat(
        str1.toString().replace(/,/g, "")
      ).toFixed(2);
      var total = Number(twoPlacedFloat).toFixed(2);
      var parts = total.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",");
      return parts.join(".");
      
    }
  }
}
