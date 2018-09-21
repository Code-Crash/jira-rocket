const rp = require("request-promise-native");
const URLSearchParams = require('url').URLSearchParams;

/**
 * @author code-crash
 * @description -- This function will handle the URL parameters
 * 				
 */
class JSONSearchParams {
    static _usp: any;
    static setJSON = function (obj: object) {
        JSONSearchParams._usp = new URLSearchParams(JSONSearchParams._JSON2URL(obj, false));
    }

    static getURLSearchParams = function () {
        return JSONSearchParams._usp;
    }

    static _JSON2URL: any = function (obj: { [key: string]: string; } = {}, parent: any) {
        var parts = [];
        for (var key in obj)
            parts.push(JSONSearchParams._parseParam(key, obj[key], parent));
        return parts.join('&');
    }

    static _parseParam: any = function (key: any, value: any, parent: any) {
        let processedKey = parent ? parent + '[' + key + ']' : key;
        if (value && ((typeof value) === 'object' || Array.isArray(value))) {
            return JSONSearchParams._JSON2URL(value, processedKey);
        }
        return processedKey + '=' + value;
    }
}


/**
 * @author code-crash
 * @desc This class will call the API with given options.
 *
 */
export default class RequestResolver {

	/**
	 * @author code-crash
	 * @description - Add the route params dynamically
	 * @param {string} _url
	 * @param {string} _routeParams
	 */
    static handleRouteParams = function (_url: string, _routeParams: { [key: string]: string; } = {}) {
        Object.keys(_routeParams).forEach((key) => {
            _url = _url.replace(new RegExp(":" + key + "(\/|$)", "g"), _routeParams[key] + "$1")
        });
        return _url;
    }

	/**
	 * @author code-crash
	 * @description - Convert URL params object to URL params
	 * @param {*} _url
	 * @param {*} _urlParams
	 */
    static handleURLParams = function (_url: string, _urlParams: object) {
        if (Object.keys(_urlParams).length > 0) {
            JSONSearchParams.setJSON(_urlParams);
            if (_url.indexOf('?') > -1) {
                _url = _url + '&' + JSONSearchParams.getURLSearchParams();
            } else {
                _url = _url + '?' + JSONSearchParams.getURLSearchParams();
            }
        }
        return _url;
    }

    /**
     * @author code-crash
     * @description - This will perform the API request for the given URL and Info
     * @param {*} _method
     * @param {*} _url
     * @param {*} _routeParams
     * @param {*} _urlParams
     * @param {*} _data
     * @param {*} _headers
     * @param {*} sCb
     * @param {*} eCb
     */
    static do = function (_method: string,
        _url: string,
        _routeParams: any = {},
        _urlParams: any = {},
        _data: any = {},
        _headers: any = {}) {

        _url = RequestResolver.handleRouteParams(_url, _routeParams);
        Object.keys(_routeParams).forEach((key) => {
            _url = _url.replace(new RegExp(":" + key + "(\/|$)", "g"), _routeParams[key] + "$1")
        });

        // Convert URL params object to URL params
        if (Object.keys(_urlParams || {}).length > 0) {
            JSONSearchParams.setJSON(_urlParams);
            _url = _url + '?' + JSONSearchParams.getURLSearchParams(); //encodeURIComponent(searchParams.getURLSearchParams());
        }

        if (_headers && _headers.constructor === Object) {
            _headers['Content-Type'] = 'application/json';
        }

        var options = {
            method: _method,
            uri: _url,
            headers: _headers,
            body: _data || {},
            json: true
        };

        return rp(options);
    };
}
