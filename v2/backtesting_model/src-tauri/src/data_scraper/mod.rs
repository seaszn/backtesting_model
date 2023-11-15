// use reqwest::blocking::*;
// use scraper::{Html, Selector};

// fn get_url_html(url: &str) -> Result<Html, reqwest::Error> {
//     match get(url) {
//         Ok(response) => match response.text() {
//             Ok(raw_html) => {
//                 return Ok(Html::parse_document(&raw_html));
//             }
//             Err(err) => return Err(err),
//         },
//         Err(err) => {
//             return Err(err);
//         }
//     }
// }

// pub fn get_url_table(url: &str) {
//     let TABLE: Selector = Selector::parse("table").unwrap();
//     let TR: Selector = Selector::parse("tr").unwrap();

//     match get_url_html(url) {
//         Ok(html) => {
//             let s = html.select(&TABLE).max_by_key(|table| {
//                 let ss = table.select(&TR).count();
//                 println!("{:?}", ss)
//             });
//             // html.select(&TABLE).max_by_key(|table| {
//             //     let f = table.select(&TR).count();
//             // })
//         }
//         Err(err) => {
//             println!("{:#?}", err)
//         }
//     }
// }
