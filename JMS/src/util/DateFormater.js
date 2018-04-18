//type: ['yyyy-MM-dd', 'yyyy-MM-dd hh:mm', 'yyyy-MM-dd hh:mm:ss', 'hh:mm', 'hh:mm:ss', 'mm:ss']
export default function (inputTime, type) {
    var date = new Date(inputTime);  
    var y = date.getFullYear();    
    var m = date.getMonth() + 1;    
    var d = date.getDate();    
    var h = date.getHours();  
    var minute = date.getMinutes();  
    var second = date.getSeconds();  

    m = m < 10 ? ('0' + m) : m;    
    d = d < 10 ? ('0' + d) : d;    
    h = h < 10 ? ('0' + h) : h;  
    minute = minute < 10 ? ('0' + minute) : minute;    
    second = second < 10 ? ('0' + second) : second;  
    
    switch(type) {
        case 'yyyy': return y
            break;
        case 'M': return m
            break;
        case 'd': return d
            break;
        case 'h': return h
            break;
        case 'm': return minute
            break;
        case 's': return second
            break;
        case 'yyyy-MM-dd': return y + '-' + m + '-' + d
            break;
        case 'yyyy-MM-dd hh:mm': return y + '-' + m + '-' + d +' ' + h + ':' + minute
            break;
        case 'hh:mm': return h + ':' + minute
            break;
        case 'hh:mm:ss': return h + ':' + minute + ':' + second
            break;
        case 'mm:ss': return minute + ':' + second
            break;
        default: return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
            break;
    }
}