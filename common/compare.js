var compare = function (prop){
    
    return function (obj1, obj2) {
        var v1;
        var v2;
        if(prop === "createdTime"){
            v1 = new Date(obj1[prop]).getTime()
            v2 = new Date(obj2[prop]).getTime()
        }else{
            v1 = new Date(obj1[prop])
            v2 = new Date(obj2[prop])
        }
       
        if (v1 > v2) {
            return -1;
        } else if (v1 < v2) {
            return 1;
        } else {
            return 0;
        }            
    }   

}
export default compare