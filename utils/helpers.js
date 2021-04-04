import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'

/*Dictionary of countries with their respective codes*/
const countryList =
[
    {
        countryCode: "AF",
        countryCallingCode: "93",
        name: "Afghanistan"
        },
        {
        countryCode: "AL",
        countryCallingCode: "355",
        name: "Albania"
        },
        {
        countryCode: "DZ",
        countryCallingCode: "213",
        name: "Algeria"
        },
        {
        countryCode: "AS",
        countryCallingCode: "1684",
        name: "American Samoa"
        },
        {
        countryCode: "AD",
        countryCallingCode: "376",
        name: "Andorra"
        },
        {
        countryCode: "AO",
        countryCallingCode: "244",
        name: "Angola"
        },
        {
        countryCode: "AI",
        countryCallingCode: "1264",
        name: "Anguilla"
        },
        {
        countryCode: "AQ",
        countryCallingCode: "672",
        name: "Antarctica"
        },
        {
        countryCode: "AG",
        countryCallingCode: "1268",
        name: "Antigua and Barbuda"
        },
        {
        countryCode: "AR",
        countryCallingCode: "54",
        name: "Argentina"
        },
        {
        countryCode: "AM",
        countryCallingCode: "374",
        name: "Armenia"
        },
        {
        countryCode: "AW",
        countryCallingCode: "297",
        name: "Aruba"
        },
        {
        countryCode: "AU",
        countryCallingCode: "61",
        name: "Australia"
        },
        {
        countryCode: "AT",
        countryCallingCode: "43",
        name: "Austria"
        },
        {
        countryCode: "AZ",
        countryCallingCode: "994",
        name: "Azerbaijan"
        },
        {
        countryCode: "BS",
        countryCallingCode: "1242",
        name: "Bahamas"
        },
        {
        countryCode: "BH",
        countryCallingCode: "973",
        name: "Bahrain"
        },
        {
        countryCode: "BD",
        countryCallingCode: "880",
        name: "Bangladesh"
        },
        {
        countryCode: "BB",
        countryCallingCode: "1246",
        name: "Barbados"
        },
        {
        countryCode: "BY",
        countryCallingCode: "375",
        name: "Belarus"
        },
        {
        countryCode: "BE",
        countryCallingCode: "32",
        name: "Belgium"
        },
        {
        countryCode: "BZ",
        countryCallingCode: "501",
        name: "Belize"
        },
        {
        countryCode: "BJ",
        countryCallingCode: "229",
        name: "Benin"
        },
        {
        countryCode: "BM",
        countryCallingCode: "1441",
        name: "Bermuda"
        },
        {
        countryCode: "BT",
        countryCallingCode: "975",
        name: "Bhutan"
        },
        {
        countryCode: "BO",
        countryCallingCode: "591",
        name: "Bolivia"
        },
        {
        countryCode: "BA",
        countryCallingCode: "387",
        name: "Bosnia and Herzegovina"
        },
        {
        countryCode: "BW",
        countryCallingCode: "267",
        name: "Botswana"
        },
        {
        countryCode: "BR",
        countryCallingCode: "55",
        name: "Brazil"
        },
        {
        countryCode: "IO",
        countryCallingCode: "246",
        name: "British Indian Ocean Territory"
        },
        {
        countryCode: "VG",
        countryCallingCode: "1284",
        name: "British Virgin Islands"
        },
        {
        countryCode: "BN",
        countryCallingCode: "673",
        name: "Brunei"
        },
        {
        countryCode: "BG",
        countryCallingCode: "359",
        name: "Bulgaria"
        },
        {
        countryCode: "BF",
        countryCallingCode: "226",
        name: "Burkina Faso"
        },
        {
        countryCode: "BI",
        countryCallingCode: "257",
        name: "Burundi"
        },
        {
        countryCode: "KH",
        countryCallingCode: "855",
        name: "Cambodia"
        },
        {
        countryCode: "CM",
        countryCallingCode: "237",
        name: "Cameroon"
        },
        {
        countryCode: "CA",
        countryCallingCode: "1",
        name: "Canada"
        },
        {
        countryCode: "CV",
        countryCallingCode: "238",
        name: "Cape Verde"
        },
        {
        countryCode: "KY",
        countryCallingCode: "1345",
        name: "Cayman Islands"
        },
        {
        countryCode: "CF",
        countryCallingCode: "236",
        name: "Central African Republic"
        },
        {
        countryCode: "TD",
        countryCallingCode: "235",
        name: "Chad"
        },
        {
        countryCode: "CL",
        countryCallingCode: "56",
        name: "Chile"
        },
        {
        countryCode: "CN",
        countryCallingCode: "86",
        name: "China"
        },
        {
        countryCode: "CX",
        countryCallingCode: "61",
        name: "Christmas Island"
        },
        {
        countryCode: "CC",
        countryCallingCode: "61",
        name: "Cocos Islands"
        },
        {
        countryCode: "CO",
        countryCallingCode: "57",
        name: "Colombia"
        },
        {
        countryCode: "KM",
        countryCallingCode: "269",
        name: "Comoros"
        },
        {
        countryCode: "CK",
        countryCallingCode: "682",
        name: "Cook Islands"
        },
        {
        countryCode: "CR",
        countryCallingCode: "506",
        name: "Costa Rica"
        },
        {
        countryCode: "HR",
        countryCallingCode: "385",
        name: "Croatia"
        },
        {
        countryCode: "CU",
        countryCallingCode: "53",
        name: "Cuba"
        },
        {
        countryCode: "CW",
        countryCallingCode: "599",
        name: "Curacao"
        },
        {
        countryCode: "CY",
        countryCallingCode: "357",
        name: "Cyprus"
        },
        {
        countryCode: "CZ",
        countryCallingCode: "420",
        name: "Czech Republic"
        },
        {
        countryCode: "CD",
        countryCallingCode: "243",
        name: "Democratic Republic of the Congo"
        },
        {
        countryCode: "DK",
        countryCallingCode: "45",
        name: "Denmark"
        },
        {
        countryCode: "DJ",
        countryCallingCode: "253",
        name: "Djibouti"
        },
        {
        countryCode: "DM",
        countryCallingCode: "1767",
        name: "Dominica"
        },
        {
        countryCode: "DO",
        countryCallingCode: "1809",
        name: "Dominican Republic"
        },
        {
        countryCode: "TL",
        countryCallingCode: "670",
        name: "East Timor"
        },
        {
        countryCode: "EC",
        countryCallingCode: "593",
        name: "Ecuador"
        },
        {
        countryCode: "EG",
        countryCallingCode: "20",
        name: "Egypt"
        },
        {
        countryCode: "SV",
        countryCallingCode: "503",
        name: "El Salvador"
        },
        {
        countryCode: "GQ",
        countryCallingCode: "240",
        name: "Equatorial Guinea"
        },
        {
        countryCode: "ER",
        countryCallingCode: "291",
        name: "Eritrea"
        },
        {
        countryCode: "EE",
        countryCallingCode: "372",
        name: "Estonia"
        },
        {
        countryCode: "ET",
        countryCallingCode: "251",
        name: "Ethiopia"
        },
        {
        countryCode: "FK",
        countryCallingCode: "500",
        name: "Falkland Islands"
        },
        {
        countryCode: "FO",
        countryCallingCode: "298",
        name: "Faroe Islands"
        },
        {
        countryCode: "FJ",
        countryCallingCode: "679",
        name: "Fiji"
        },
        {
        countryCode: "FI",
        countryCallingCode: "358",
        name: "Finland"
        },
        {
        countryCode: "FR",
        countryCallingCode: "33",
        name: "France"
        },
        {
        countryCode: "PF",
        countryCallingCode: "689",
        name: "French Polynesia"
        },
        {
        countryCode: "GA",
        countryCallingCode: "241",
        name: "Gabon"
        },
        {
        countryCode: "GM",
        countryCallingCode: "220",
        name: "Gambia"
        },
        {
        countryCode: "GE",
        countryCallingCode: "995",
        name: "Georgia"
        },
        {
        countryCode: "DE",
        countryCallingCode: "49",
        name: "Germany"
        },
        {
        countryCode: "GH",
        countryCallingCode: "233",
        name: "Ghana"
        },
        {
        countryCode: "GI",
        countryCallingCode: "350",
        name: "Gibraltar"
        },
        {
        countryCode: "GR",
        countryCallingCode: "30",
        name: "Greece"
        },
        {
        countryCode: "GL",
        countryCallingCode: "299",
        name: "Greenland"
        },
        {
        countryCode: "GD",
        countryCallingCode: "1473",
        name: "Grenada"
        },
        {
        countryCode: "GU",
        countryCallingCode: "1671",
        name: "Guam"
        },
        {
        countryCode: "GT",
        countryCallingCode: "502",
        name: "Guatemala"
        },
        {
        countryCode: "GN",
        countryCallingCode: "224",
        name: "Guinea"
        },
        {
        countryCode: "GW",
        countryCallingCode: "245",
        name: "Guinea-Bissau"
        },
        {
        countryCode: "GY",
        countryCallingCode: "592",
        name: "Guyana"
        },
        {
        countryCode: "HT",
        countryCallingCode: "509",
        name: "Haiti"
        },
        {
        countryCode: "HN",
        countryCallingCode: "504",
        name: "Honduras"
        },
        {
        countryCode: "HK",
        countryCallingCode: "852",
        name: "Hong Kong"
        },
        {
        countryCode: "HU",
        countryCallingCode: "36",
        name: "Hungary"
        },
        {
        countryCode: "IS",
        countryCallingCode: "354",
        name: "Iceland"
        },
        {
        countryCode: "IN",
        countryCallingCode: "91",
        name: "India"
        },
        {
        countryCode: "ID",
        countryCallingCode: "62",
        name: "Indonesia"
        },
        {
        countryCode: "IR",
        countryCallingCode: "98",
        name: "Iran"
        },
        {
        countryCode: "IQ",
        countryCallingCode: "964",
        name: "Iraq"
        },
        {
        countryCode: "IE",
        countryCallingCode: "353",
        name: "Ireland"
        },
        {
        countryCode: "IL",
        countryCallingCode: "972",
        name: "Israel"
        },
        {
        countryCode: "IT",
        countryCallingCode: "39",
        name: "Italy"
        },
        {
        countryCode: "CI",
        countryCallingCode: "225",
        name: "Ivory Coast"
        },
        {
        countryCode: "JM",
        countryCallingCode: "1876",
        name: "Jamaica"
        },
        {
        countryCode: "JP",
        countryCallingCode: "81",
        name: "Japan"
        },
        {
        countryCode: "JO",
        countryCallingCode: "962",
        name: "Jordan"
        },
        {
        countryCode: "KZ",
        countryCallingCode: "7",
        name: "Kazakhstan"
        },
        {
        countryCode: "KE",
        countryCallingCode: "254",
        name: "Kenya"
        },
        {
        countryCode: "KI",
        countryCallingCode: "686",
        name: "Kiribati"
        },
        {
        countryCode: "XK",
        countryCallingCode: "383",
        name: "Kosovo"
        },
        {
        countryCode: "KW",
        countryCallingCode: "965",
        name: "Kuwait"
        },
        {
        countryCode: "KG",
        countryCallingCode: "996",
        name: "Kyrgyzstan"
        },
        {
        countryCode: "LA",
        countryCallingCode: "856",
        name: "Laos"
        },
        {
        countryCode: "LV",
        countryCallingCode: "371",
        name: "Latvia"
        },
        {
        countryCode: "LB",
        countryCallingCode: "961",
        name: "Lebanon"
        },
        {
        countryCode: "LS",
        countryCallingCode: "266",
        name: "Lesotho"
        },
        {
        countryCode: "LR",
        countryCallingCode: "231",
        name: "Liberia"
        },
        {
        countryCode: "LY",
        countryCallingCode: "218",
        name: "Libya"
        },
        {
        countryCode: "LI",
        countryCallingCode: "423",
        name: "Liechtenstein"
        },
        {
        countryCode: "LT",
        countryCallingCode: "370",
        name: "Lithuania"
        },
        {
        countryCode: "LU",
        countryCallingCode: "352",
        name: "Luxembourg"
        },
        {
        countryCode: "MO",
        countryCallingCode: "853",
        name: "Macau"
        },
        {
        countryCode: "MK",
        countryCallingCode: "389",
        name: "Macedonia"
        },
        {
        countryCode: "MG",
        countryCallingCode: "261",
        name: "Madagascar"
        },
        {
        countryCode: "MW",
        countryCallingCode: "265",
        name: "Malawi"
        },
        {
        countryCode: "MY",
        countryCallingCode: "60",
        name: "Malaysia"
        },
        {
        countryCode: "MV",
        countryCallingCode: "960",
        name: "Maldives"
        },
        {
        countryCode: "ML",
        countryCallingCode: "223",
        name: "Mali"
        },
        {
        countryCode: "MT",
        countryCallingCode: "356",
        name: "Malta"
        },
        {
        countryCode: "MH",
        countryCallingCode: "692",
        name: "Marshall Islands"
        },
        {
        countryCode: "MR",
        countryCallingCode: "222",
        name: "Mauritania"
        },
        {
        countryCode: "MU",
        countryCallingCode: "230",
        name: "Mauritius"
        },
        {
        countryCode: "YT",
        countryCallingCode: "262",
        name: "Mayotte"
        },
        {
        countryCode: "MX",
        countryCallingCode: "52",
        name: "Mexico"
        },
        {
        countryCode: "FM",
        countryCallingCode: "691",
        name: "Micronesia"
        },
        {
        countryCode: "MD",
        countryCallingCode: "373",
        name: "Moldova"
        },
        {
        countryCode: "MC",
        countryCallingCode: "377",
        name: "Monaco"
        },
        {
        countryCode: "MN",
        countryCallingCode: "976",
        name: "Mongolia"
        },
        {
        countryCode: "ME",
        countryCallingCode: "382",
        name: "Montenegro"
        },
        {
        countryCode: "MS",
        countryCallingCode: "1664",
        name: "Montserrat"
        },
        {
        countryCode: "MA",
        countryCallingCode: "212",
        name: "Morocco"
        },
        {
        countryCode: "MZ",
        countryCallingCode: "258",
        name: "Mozambique"
        },
        {
        countryCode: "MM",
        countryCallingCode: "95",
        name: "Myanmar"
        },
        {
        countryCode: "NA",
        countryCallingCode: "264",
        name: "Namibia"
        },
        {
        countryCode: "NR",
        countryCallingCode: "674",
        name: "Nauru"
        },
        {
        countryCode: "NP",
        countryCallingCode: "977",
        name: "Nepal"
        },
        {
        countryCode: "NL",
        countryCallingCode: "31",
        name: "Netherlands"
        },
        {
        countryCode: "AN",
        countryCallingCode: "599",
        name: "Netherlands Antilles"
        },
        {
        countryCode: "NC",
        countryCallingCode: "687",
        name: "New Caledonia"
        },
        {
        countryCode: "NZ",
        countryCallingCode: "64",
        name: "New Zealand"
        },
        {
        countryCode: "NI",
        countryCallingCode: "505",
        name: "Nicaragua"
        },
        {
        countryCode: "NE",
        countryCallingCode: "227",
        name: "Niger"
        },
        {
        countryCode: "NG",
        countryCallingCode: "234",
        name: "Nigeria"
        },
        {
        countryCode: "NU",
        countryCallingCode: "683",
        name: "Niue"
        },
        {
        countryCode: "KP",
        countryCallingCode: "850",
        name: "North Korea"
        },
        {
        countryCode: "MP",
        countryCallingCode: "1670",
        name: "Northern Mariana Islands"
        },
        {
        countryCode: "NO",
        countryCallingCode: "47",
        name: "Norway"
        },
        {
        countryCode: "OM",
        countryCallingCode: "968",
        name: "Oman"
        },
        {
        countryCode: "PK",
        countryCallingCode: "92",
        name: "Pakistan"
        },
        {
        countryCode: "PW",
        countryCallingCode: "680",
        name: "Palau"
        },
        {
        countryCode: "PS",
        countryCallingCode: "970",
        name: "Palestine"
        },
        {
        countryCode: "PA",
        countryCallingCode: "507",
        name: "Panama"
        },
        {
        countryCode: "PG",
        countryCallingCode: "675",
        name: "Papua New Guinea"
        },
        {
        countryCode: "PY",
        countryCallingCode: "595",
        name: "Paraguay"
        },
        {
        countryCode: "PE",
        countryCallingCode: "51",
        name: "Peru"
        },
        {
        countryCode: "PH",
        countryCallingCode: "63",
        name: "Philippines"
        },
        {
        countryCode: "PN",
        countryCallingCode: "64",
        name: "Pitcairn"
        },
        {
        countryCode: "PL",
        countryCallingCode: "48",
        name: "Poland"
        },
        {
        countryCode: "PT",
        countryCallingCode: "351",
        name: "Portugal"
        },
        {
        countryCode: "PR",
        countryCallingCode: "1787",
        name: "Puerto Rico"
        },
        {
        countryCode: "QA",
        countryCallingCode: "974",
        name: "Qatar"
        },
        {
        countryCode: "CG",
        countryCallingCode: "242",
        name: "Republic of the Congo"
        },
        {
        countryCode: "RE",
        countryCallingCode: "262",
        name: "Reunion"
        },
        {
        countryCode: "RO",
        countryCallingCode: "40",
        name: "Romania"
        },
        {
        countryCode: "RU",
        countryCallingCode: "7",
        name: "Russia"
        },
        {
        countryCode: "RW",
        countryCallingCode: "250",
        name: "Rwanda"
        },
        {
        countryCode: "BL",
        countryCallingCode: "590",
        name: "Saint Barthelemy"
        },
        {
        countryCode: "SH",
        countryCallingCode: "290",
        name: "Saint Helena"
        },
        {
        countryCode: "KN",
        countryCallingCode: "1869",
        name: "Saint Kitts and Nevis"
        },
        {
        countryCode: "LC",
        countryCallingCode: "1758",
        name: "Saint Lucia"
        },
        {
        countryCode: "MF",
        countryCallingCode: "590",
        name: "Saint Martin"
        },
        {
        countryCode: "PM",
        countryCallingCode: "508",
        name: "Saint Pierre and Miquelon"
        },
        {
        countryCode: "VC",
        countryCallingCode: "1784",
        name: "Saint Vincent and the Grenadines"
        },
        {
        countryCode: "WS",
        countryCallingCode: "685",
        name: "Samoa"
        },
        {
        countryCode: "SM",
        countryCallingCode: "378",
        name: "San Marino"
        },
        {
        countryCode: "ST",
        countryCallingCode: "239",
        name: "Sao Tome and Principe"
        },
        {
        countryCode: "SA",
        countryCallingCode: "966",
        name: "Saudi Arabia"
        },
        {
        countryCode: "SN",
        countryCallingCode: "221",
        name: "Senegal"
        },
        {
        countryCode: "RS",
        countryCallingCode: "381",
        name: "Serbia"
        },
        {
        countryCode: "SC",
        countryCallingCode: "248",
        name: "Seychelles"
        },
        {
        countryCode: "SL",
        countryCallingCode: "232",
        name: "Sierra Leone"
        },
        {
        countryCode: "SG",
        countryCallingCode: "65",
        name: "Singapore"
        },
        {
        countryCode: "SX",
        countryCallingCode: "1721",
        name: "Sint Maarten"
        },
        {
        countryCode: "SK",
        countryCallingCode: "421",
        name: "Slovakia"
        },
        {
        countryCode: "SI",
        countryCallingCode: "386",
        name: "Slovenia"
        },
        {
        countryCode: "SB",
        countryCallingCode: "677",
        name: "Solomon Islands"
        },
        {
        countryCode: "SO",
        countryCallingCode: "252",
        name: "Somalia"
        },
        {
        countryCode: "ZA",
        countryCallingCode: "27",
        name: "South Africa"
        },
        {
        countryCode: "KR",
        countryCallingCode: "82",
        name: "South Korea"
        },
        {
        countryCode: "SS",
        countryCallingCode: "211",
        name: "South Sudan"
        },
        {
        countryCode: "ES",
        countryCallingCode: "34",
        name: "Spain"
        },
        {
        countryCode: "LK",
        countryCallingCode: "94",
        name: "Sri Lanka"
        },
        {
        countryCode: "SD",
        countryCallingCode: "249",
        name: "Sudan"
        },
        {
        countryCode: "SR",
        countryCallingCode: "597",
        name: "Suriname"
        },
        {
        countryCode: "SJ",
        countryCallingCode: "47",
        name: "Svalbard and Jan Mayen"
        },
        {
        countryCode: "SZ",
        countryCallingCode: "268",
        name: "Swaziland"
        },
        {
        countryCode: "SE",
        countryCallingCode: "46",
        name: "Sweden"
        },
        {
        countryCode: "CH",
        countryCallingCode: "41",
        name: "Switzerland"
        },
        {
        countryCode: "SY",
        countryCallingCode: "963",
        name: "Syria"
        },
        {
        countryCode: "TW",
        countryCallingCode: "886",
        name: "Taiwan"
        },
        {
        countryCode: "TJ",
        countryCallingCode: "992",
        name: "Tajikistan"
        },
        {
        countryCode: "TZ",
        countryCallingCode: "255",
        name: "Tanzania"
        },
        {
        countryCode: "TH",
        countryCallingCode: "66",
        name: "Thailand"
        },
        {
        countryCode: "TG",
        countryCallingCode: "228",
        name: "Togo"
        },
        {
        countryCode: "TK",
        countryCallingCode: "690",
        name: "Tokelau"
        },
        {
        countryCode: "TO",
        countryCallingCode: "676",
        name: "Tonga"
        },
        {
        countryCode: "TT",
        countryCallingCode: "1868",
        name: "Trinidad and Tobago"
        },
        {
        countryCode: "TN",
        countryCallingCode: "216",
        name: "Tunisia"
        },
        {
        countryCode: "TR",
        countryCallingCode: "90",
        name: "Turkey"
        },
        {
        countryCode: "TM",
        countryCallingCode: "993",
        name: "Turkmenistan"
        },
        {
        countryCode: "TC",
        countryCallingCode: "1649",
        name: "Turks and Caicos Islands"
        },
        {
        countryCode: "TV",
        countryCallingCode: "688",
        name: "Tuvalu"
        },
        {
        countryCode: "VI",
        countryCallingCode: "1340",
        name: "U.S. Virgin Islands"
        },
        {
        countryCode: "UG",
        countryCallingCode: "256",
        name: "Uganda"
        },
        {
        countryCode: "UA",
        countryCallingCode: "380",
        name: "Ukraine"
        },
        {
        countryCode: "AE",
        countryCallingCode: "971",
        name: "United Arab Emirates"
        },
        {
        countryCode: "GB",
        countryCallingCode: "44",
        name: "United Kingdom"
        },
        {
        countryCode: "US",
        countryCallingCode: "1",
        name: "United States"
        },
        {
        countryCode: "UY",
        countryCallingCode: "598",
        name: "Uruguay"
        },
        {
        countryCode: "UZ",
        countryCallingCode: "998",
        name: "Uzbekistan"
        },
        {
        countryCode: "VU",
        countryCallingCode: "678",
        name: "Vanuatu"
        },
        {
        countryCode: "VA",
        countryCallingCode: "379",
        name: "Vatican"
        },
        {
        countryCode: "VE",
        countryCallingCode: "58",
        name: "Venezuela"
        },
        {
        countryCode: "VN",
        countryCallingCode: "84",
        name: "Vietnam"
        },
        {
        countryCode: "WF",
        countryCallingCode: "681",
        name: "Wallis and Futuna"
        },
        {
        countryCode: "EH",
        countryCallingCode: "212",
        name: "Western Sahara"
        },
        {
        countryCode: "YE",
        countryCallingCode: "967",
        name: "Yemen"
        },
        {
        countryCode: "ZM",
        countryCallingCode: "260",
        name: "Zambia"
        },
        {
        countryCode: "ZW",
        countryCallingCode: "263",
        name: "Zimbabwe"
        },
        
]


export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
}

export const loadImageFromGallery = async (array) =>{
    const response = {status: false, image: null}

    const resultPermissions = await Permissions.askAsync(Permissions.CAMERA)

    if(resultPermissions.status === "denied"){
        Alert.alert("Debes de darle permiso para acceder a las imagenes del telefono.")
        return response
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: array /*image Aspect 3:4, 2:2 */
    })

    if(result.cancelled){
        return response
    }

    response.status = true
    response.image = result.uri 

    return response
}

export const fileToBlob = async(path) =>{
    const file = await fetch(path)
    const blob = await file.blob()
    return blob
}

/*This function is based on the list of countries with their copyright and depending on the calling 
code it returns the CountryCode to paint it in the Picker*/
export const getCountryCode =(countryCallingCode) =>{
    const country = countryList.filter(country => country.countryCallingCode ===countryCallingCode)
    const countryCode = country.map(coun => coun.countryCode)[0]
    return countryCode
}