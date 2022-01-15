let url = require("url"),
    http = require("http"),
    server = null,
    host = '0.0.0.0',
    port = process.env.PORT || 3000, 
    puppeteer = require ('puppeteer');
   

// function which acts as a server
function SERVER(req,res){

    //initiating Puppeteer
    puppeteer.launch ({
        headless: true,
        timeout: 0
    })
    .then (async browser => {

        try{

        const url = 'https://myscp.ml3ds-icon.com/scp/86932/site-map/100697';

        //opening a new page and navigating to Reddit
        const page = await browser.newPage();

        // Configure the navigation timeout
        // await page.setDefaultNavigationTimeout(800000);

        await page.goto(url,{
            waitUntil: 'load',
            // Remove the timeout
            timeout: 0
        });

        //manipulating the page's content
        let data = await page.evaluate (async () => {

            let interval,menu_btn,inner,
            checkElement = function(){

                return new Promise((r) => {

                    interval = function(){

                        let stat_cont = document.querySelector("#statuses-container");
                        let btns_cont = document.querySelector(".floating-menu-buttons");

                        console.log(btns_cont)
                        console.log(stat_cont)
                        if(stat_cont){
                            clearInterval(interval);
                            return r(
                                `
                                <!DOCTYPE html>
                                <html>
                                    <body>
                                        ${document.querySelector('body').innerHTML}
                                    </body>
                                </html>
                                `
                            );
                        }

                        if(btns_cont){
                            menu_btn = document.querySelector(".floating-menu-buttons button"); 
                            menu_btn.click();
                        }

                    } // interval()

                    setInterval(interval,3000);

                }) // Promise

            } // checkElement()

            inner = await checkElement();
            return inner;

        }) // page.evaluate

        //closing the browser
        //await browser.close();

        res.setHeader("Content-Type", "text/plain");
        res.end(String(data));

        return;

        } catch(errr){

            res.setHeader("Content-Type", "text/plain");
            res.end(String(errr));

        }

    })
    //handling any errors
    .catch (function (err) {

        res.setHeader("Content-Type", "text/plain");
        res.end(String(err));

    });

} // SERVER


// creating an instance of server
server = http.Server(SERVER);
server.listen(port, host, ()=>{

    console.log(`server running on ${host}:${port}`);

})
