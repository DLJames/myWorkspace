define([
    'dojo/_base/declare'
], function(declare) {
    var util = declare('mylearning_langUtil', [], {
        isBoolean : function(obj) {
            return Object.prototype.toString.call(obj) === '[object Boolean]';
        },
        
        isObject : function (obj) {
            return Object.prototype.toString.call(obj) === '[object Object]';
        },
        
        isArray : function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        
        isWindow : function (obj) {
            return obj !== null && obj === obj.window;
        },
        
        hasOwnProp : function (obj) {
            return Object.prototype.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf');
        },
        
        isPlainObject : function (obj) {
            if (!this.isObject(obj) || obj.nodeType || this.isWindow(obj)) {
                return false;
            }
            
            if (obj.constructor && !this.hasOwnProp(obj)) {
                return false;
            }
            return true;
        },
        
        extend : function () {
            var args, deep, i, len, target, source, copy, src, isArrayCopy, clone;
          
            args = [].slice.call(arguments);
            deep = false;
            target = args[0] || {};
            i = 0;
            
            if (this.isBoolean(target)) {
                deep = args.shift();
                target = args[0] || {};
            }
            
            len = args.length;
            
            if(len === 1) {
                target = this;
            }
            
            for (; i < len; i++) {
                if (source = args[i] || {}) {
                    for (var name in source) {
                        src = target[name];
                        copy = source[name];
                        
                        if(src === copy) {
                            continue;
                        }
                        
                        if(deep && copy && this.isPlainObject(copy) || (isArrayCopy = this.isArray(copy))) {
                            if(isArrayCopy) {
                                isArrayCopy = false;
                                clone = this.isArray(src) ? src : [];
                            }else{
                                clone = this.isPlainObject(src) ? src : {};
                            }
                            target[name] = this.extend(deep, clone, copy);
                        }else if(copy !== void 0) {
                            target[name] = copy;
                        }
                    }
                }
            }
            return target;
        }
    });
    
    return util;
});