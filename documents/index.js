export const pdfFile = ({date, time, duration, price, firstName, lastName, receiptNumber}) => {

    return `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>Receipt</title>
                <style>
                    body {
                        text-align: center,
                        display: flex
                    },
                    h5 {
                        text-align: center
                    },
                    p {
                        text-align: center
                    },
                    .centerdiv {
                        display: flex, 
                        justify-content: center, 
                        text-align: left
                    }
                </style>
            </head>
            <body>
                <div>
                <p>
                <h4>Cip de Vries, RMT</h4>
                268 Shuter Street, Toronto ON, M5A 1W3
            <br />
                416-258-1230
            </p>
            <p>
                Registration Number: U035
            <br />
                HST number: 845 918 200 RT0001
            </p>
            <h5>Official Receipt</h5>
            <div class="centerdiv">
                <table>
                    <thead>
                        <tr>
                            <th>Date of treatment:</th>
                            <td>${date}</td>
                        </tr>
                        <tr>
                            <th>Time of treatment:</th>
                            <td>${time}</td>
                        </tr>
                        <tr>
                            <th>Duration:</th>
                            <td>${duration} minutes</td>
                        </tr>
                        <tr>
                            <th>Payment received:</th>
                            <td>${price}</td>
                        </tr>
                        <tr>
                            <th>Payment received from:</th>
                            <td>${firstName} ${lastName}</td>
                        </tr>
                        <tr>
                            <th>Receipt number:</th>
                            <td>${receiptNumber}</td>
                        </tr>
                    </thead>
                </table>
                </div>
            </body>
        </html>
    `
}
