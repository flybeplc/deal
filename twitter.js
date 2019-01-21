/*
Useful functions when extracting tweets from https://twitter.com
*/

//Twitter only shows to the nearest minute.
//meta data is embedded in each date item with the millisecond timestamp
function getMillisecondTimestamp() {
    return [].slice.call(document.querySelectorAll("span.js-short-timestamp")).map(e => {
        return {
            t: +e.dataset['timeMs'],
            el: e
        }
    }).sort((a, b) => a.t < b.t).reverse()[1]
}