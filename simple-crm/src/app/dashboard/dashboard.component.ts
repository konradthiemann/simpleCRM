import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogLogInComponent } from '../dialog-log-in/dialog-log-in.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { Firestore, collection, docData, getDocs } from '@angular/fire/firestore';
import { Chart, registerables } from 'chart.js';
import { DialogAddFinanceComponent } from '../dialog-add-finance/dialog-add-finance.component';
import { User } from '../models/user.class';
import { single } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private sharedService: SharedService, private firestore: Firestore, private router: Router,) { }

  ngOnInit(): void {
    this.loadContent();
    this.createBlockchainJson();
    this.createBlockchainHistoryJson();

  }


  test: any = '2';


  db = this.firestore;
  id: any;
  name: string | undefined;
  user: User = new User;


  API_URL: string = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Ctether%2Cbinancecoin%2Cusd-coin&vs_currencies=eur';
  API_HISTORY_URL: string = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=eur&days=7&interval=daily';
  blockchainData: any;
  blockchainNames:any = ['bitcoin', 'ethereum', 'tether', 'binancecoin', 'usd-coin'];
  blockchainDays:any = [null, null, null, null, null, null, null, null];
  blockchainPrices: any = [
    { 'bitcoin': null },
    { 'ethereum': null },
    { 'tether': null },
    { 'binancecoin': null },
    { 'usd-coin': null }
  ];

  blockchainHistory: any = [
    { 'bitcoin': null },
    { 'ethereum': null },
    { 'tether': null },
    { 'binancecoin': null },
    { 'usd-coin': null }
  ];
  blockchainHistoryBitcoin:any;
  blockchainHistoryEthereum:any;
  blockchainHistoryTether:any;
  blockchainHistoryBinanceCoin:any;
  blockchainHistoryUsdCoin:any;

  latestExpense: any = [
    { "latestTimestamp": 0 },
    { "latestFirstName": null },
    { "latestLastName": null },
    { "latestAmount": 0 },
    { "latestCategory": null },
    { "latestNote": null },
  ];

  expenses: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  income: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  monthAmount: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  expensesJSON: any = [
    [
      { "category": "Grocery Shopping/Food & Drinks", "amount": 0 },
      { "category": "Household & Personal Care Products", "amount": 0 },
      { "category": "Cosmetics", "amount": 0 },
      { "category": "Fuel/Gas", "amount": 0 },
      { "category": "Online Shopping", "amount": 0 },
      { "category": "Dining Out/Entertainment", "amount": 0 },
      { "category": "Clothing & Jewelry", "amount": 0 },
      { "category": "Bills", "amount": 0 },
      { "category": "Education", "amount": 0 },
      { "category": "Home (Decor, Organization, etc.)", "amount": 0 },
      { "category": "Hobbies/Accessories, etc.", "amount": 0 },
      { "category": "Leisure Activities", "amount": 0 },
      { "category": "Gifts", "amount": 0 },
      { "category": "Eating Out", "amount": 0 },
      { "category": "Health/Medications/...", "amount": 0 },
      { "category": "Special Purchases/Expenses", "amount": 0 },
      { "category": "Mobility", "amount": 0 },
      { "category": "Miscellaneous Expenses", "amount": 0 }
    ]
  ]

 
  loadContent() {
    // console.log(this.sharedService.getCurrentUserId())
    let id = this.sharedService.getCurrentUserId();
    if (id !== undefined) {
      docData(doc(this.firestore, `users/${id}`)).subscribe((user) => {
        this.name = user['firstName'];
        this.id = id;
      });
      this.calcExpenses();

    } else {
      this.router.navigate(['/log-in']);
    }
  }

  async calcExpenses() {
    const db = getFirestore();
    const colRef = collection(db, "finances");
    const docsSnap = await getDocs(colRef);

    for (let i = 0; i < 11; i++) {
      docsSnap.forEach(doc => {
        let timestamp = doc.get('creationDate');
        let month = new Date(timestamp).getMonth();
        let year = new Date(timestamp).getFullYear();
        let currentYear = new Date().getFullYear();
        let currentMonth = new Date().getMonth();
        let firstName = doc.get('firstName');
        let lastName = doc.get('lastName');
        let amount = doc.get('amount');
        let category = doc.get('category');
        let note = doc.get('note');
        let transaction = doc.get('transaction');

        if (i == month && year == currentYear && transaction == 'expense') {
          this.expenses[i] += +amount;
        }

        if (i == month && year == currentYear && transaction == 'income') {
          this.income[i] += +amount;
        }

        if (currentYear == year && currentMonth == month && transaction == 'expense') {
          this.calcMonthOverview(category, amount)
        }

        if (timestamp > this.latestExpense[0]['latestTimestamp'] && transaction == 'expense') {
          this.latestExpense[0]['latestTimestamp'] = timestamp;
          this.latestExpense[0]['latestFirstName'] = firstName;
          this.latestExpense[0]['latestLastName'] = lastName;
          this.latestExpense[0]['latestAmount'] = amount;
          this.latestExpense[0]['latestCategory'] = category;
          this.latestExpense[0]['latestNote'] = note;
        }
      });
    }
    this.loadTestChart();
    this.loadPieChart();
    this.loadBlockchainChartHistory();

    // this.loadLatestExpense();
  }

  calcMonthOverview(category: any, amount: any) {
    for (let j = 0; j < this.expensesJSON[0].length; j++) {
      if (this.expensesJSON[0][j]['category'] == category) {
        this.expensesJSON[0][j]['amount'] += +amount;
        this.monthAmount[j] += +amount;
      }
    }
  }

  loadLatestExpense() {

  }

  loadPieChart() {
    new Chart("myChartPie", {
      type: 'pie',
      data: {
        labels: [
          'Grocery Shopping/Food & Drinks',
          'Household & Personal Care Products',
          'Cosmetics',
          'Fuel/Gas',
          'Online Shopping',
          'Dining Out/Entertainment',
          'Clothing & Jewelry',
          'Bills',
          'Education',
          'Home (Decor, Organization, etc.)',
          'Hobbies/Accessories, etc.',
          'Leisure Activities',
          'Gifts',
          'Eating Out',
          'Health/Medications/...',
          'Special Purchases/Expenses',
          'Mobility',
          'Miscellaneous Expenses'
        ],
        datasets: [{
          label: 'Month overview',
          data: [
            this.monthAmount[0],
            this.monthAmount[1],
            this.monthAmount[2],
            this.monthAmount[3],
            this.monthAmount[4],
            this.monthAmount[5],
            this.monthAmount[6],
            this.monthAmount[7],
            this.monthAmount[8],
            this.monthAmount[9],
            this.monthAmount[10],
            this.monthAmount[11],
            this.monthAmount[12],
            this.monthAmount[13],
            this.monthAmount[14],
            this.monthAmount[15],
            this.monthAmount[16],
            this.monthAmount[17],
          ],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(64, 102, 86)',
            'rgb(5, 23, 86)',
            'rgb(231, 78, 222)',
            'rgb(255, 98, 1)',
            'rgb(23, 67, 135)',
            'rgb(2, 52, 233)',
            'rgb(12, 255, 4)',
            'rgb(42, 124, 254)',
          ],
          hoverOffset: 4
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'white'
            }
          },
          x: {
            ticks: {
              color: 'white'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'white'
            }
          }
        }
      }
    });

  }

  calcIncome() {

  }

  loadTestChart() {
    var myChart = new Chart("myChart", {
      type: 'bar',
      data: {
        labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],

        datasets: [{
          label: 'expenses in €',
          data: [this.expenses[0], this.expenses[1], this.expenses[2], this.expenses[3], this.expenses[4], this.expenses[5], this.expenses[6], this.expenses[7], this.expenses[8], this.expenses[9], this.expenses[10], this.expenses[11]],
          backgroundColor: [
            'rgba(255, 0, 0, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 2
        },
        {
          label: 'income in €',
          data: [this.income[0], this.income[1], this.income[2], this.income[3], this.income[4], this.income[5], this.income[6], this.income[7], this.income[8], this.income[9], this.income[10], this.income[11]],
          backgroundColor: [
            'rgba(0, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(0, 159, 64, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'white'
            }
          },
          x: {
            ticks: {
              color: 'white'
            }
          }
        },
        indexAxis: 'y',
        elements: {
          bar: {
            borderWidth: 2,

          }
        },
        responsive: false,
        plugins: {
          legend: {
            labels: {
              color: 'white'
            },
            position: 'top',
          },
        }
      },
    });
  }

  openAddFinanceDialog() {
    const dialog = this.dialog.open(DialogAddFinanceComponent);
    dialog.componentInstance.userId = this.id;
    dialog.componentInstance.user = new User(this.user.toJSON());
  }
  //Blockchain

  async createBlockchainJson() {
    let response = await fetch(this.API_URL);
    let blockchainApi = await response.json();
    this.blockchainData = blockchainApi;
    // console.log(blockchainApi);
    this.blockchainPrices[0] = this.blockchainData['bitcoin']['eur'];
    this.blockchainPrices[1] = this.blockchainData['ethereum']['eur'];
    this.blockchainPrices[2] = this.blockchainData['tether']['eur'];
    this.blockchainPrices[3] = this.blockchainData['binancecoin']['eur'];
    this.blockchainPrices[4] = this.blockchainData['usd-coin']['eur'];
    this.loadBlockchainChart();
  }

  async createBlockchainHistoryJson(){
    for (let i = 0; i < this.blockchainNames.length; i++) {
      let response = await fetch(`https://api.coingecko.com/api/v3/coins/${this.blockchainNames[i]}/market_chart?vs_currency=eur&days=7&interval=daily`)
      let blockchainApi = await response.json();
      this.blockchainHistory[i] = blockchainApi;

      // console.log(this.blockchainHistory[i]);
      this.getHistoryDate(this.blockchainHistory);
    }
    this.getHistoryData(this.blockchainHistory);
  }

  getHistoryDate(history:any){
    for (let i = 0; i < history[0]['prices'].length; i++) {
      
      var newDate = new Date(history[0]['prices'][i][0]);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = newDate.getFullYear();
      var month = months[newDate.getMonth()];
      var date = newDate.getDate();
      var time = date + ' ' + month + ' ' + year ;
      
      this.blockchainDays[i] = time;
    }
  }

  getHistoryData(history:any){
    for (let i = 0; i < history.length; i++) {
      this.getSingleHistoryDataSet(history[i], i);
    }
  }

  blockchainHistoryData:any = [
    {'historyPrices' : []},
    {'historyPrices' : []},
    {'historyPrices' : []},
    {'historyPrices' : []},
    {'historyPrices' : []},

  ];

  
  getSingleHistoryDataSet(history:any, j:any){
    for (let i = 0; i < history['prices'].length; i++) {
      this.blockchainHistoryData[j]['historyPrices'][i] = history['prices'][i][1];
    }
  }

  loadBlockchainChart() {
    var myBlockchainChart = new Chart("myBlockchainChart", {
      type: 'bar',
      data: {
        labels: ['cryprocurrency'],

        datasets: [{
          label: 'Bitcoin (BTC)',
          data: [this.blockchainPrices[0]],
          backgroundColor: [
            'rgba(255, 0, 0, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 2
        },
        {
          label: 'Ethereum (ETH)',
          data: [this.blockchainPrices[1]],
          backgroundColor: [
            'rgba(255, 100, 0, 0.2)',
          ],
          borderColor: [
            'rgba(255, 100, 0, 1)',
          ],
          borderWidth: 2
        },
        {
          label: 'Tether (USDT)',
          data: [this.blockchainPrices[2]],
          backgroundColor: [
            'rgba(255, 0, 100, 0.2)',
          ],
          borderColor: [
            'rgba(255, 0, 100, 1)',
          ],
          borderWidth: 2
        },
        {
          label: 'Binance Coin (BNB)',
          data: [this.blockchainPrices[3]],
          backgroundColor: [
            'rgba(255, 200, 0, 0.2)',
          ],
          borderColor: [
            'rgba(255, 200, 0, 1)',
          ],
          borderWidth: 2
        },
        {
          label: 'USD Coin (USDC)',
          data: [this.blockchainPrices[4]],
          backgroundColor: [
            'rgba(255, 0, 200, 0.2)',
          ],
          borderColor: [
            'rgba(255, 0, 200, 1)',
          ],
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'white'
            }
          },
          x: {
            ticks: {
              color: 'white'
            }
          }
        },
        indexAxis: 'x',
        elements: {
          bar: {
            borderWidth: 2,

          }
        },
        responsive: false,
        plugins: {
          legend: {
            labels: {
              color: 'white'
            },
            position: 'top',
          },
        }
      },
    });
  }

  loadBlockchainChartHistory() {
    var myBlockchainChartHistory = new Chart("myBlockchainChartHistory", {
      type: 'line',
      data: {
        labels: [this.blockchainDays[0], this.blockchainDays[1], this.blockchainDays[2], this.blockchainDays[3], this.blockchainDays[4], this.blockchainDays[5], this.blockchainDays[6]],
        datasets: [
          {
            label: 'Bitcoin',
            data: [this.blockchainHistoryData[0]['historyPrices'][0], this.blockchainHistoryData[0]['historyPrices'][1], this.blockchainHistoryData[0]['historyPrices'][2], this.blockchainHistoryData[0]['historyPrices'][3], this.blockchainHistoryData[0]['historyPrices'][4], this.blockchainHistoryData[0]['historyPrices'][5], this.blockchainHistoryData[0]['historyPrices'][6], this.blockchainHistoryData[0]['historyPrices'][7]],
            borderColor: [
              'rgba(255, 0, 0, 1)',
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
            ],
          },
          {
            label: 'Ethereum (ETH)',
            data: [this.blockchainHistoryData[1]['historyPrices'][0], this.blockchainHistoryData[1]['historyPrices'][1], this.blockchainHistoryData[1]['historyPrices'][2], this.blockchainHistoryData[1]['historyPrices'][3], this.blockchainHistoryData[1]['historyPrices'][4], this.blockchainHistoryData[1]['historyPrices'][5], this.blockchainHistoryData[1]['historyPrices'][6], this.blockchainHistoryData[1]['historyPrices'][7]],
            backgroundColor: [
              'rgba(255, 100, 0, 0.2)',
            ],
            borderColor: [
              'rgba(255, 100, 0, 1)',
            ],
          },
          {
            label: 'Tether (USDT)',
            data: [this.blockchainHistoryData[2]['historyPrices'][0], this.blockchainHistoryData[2]['historyPrices'][1], this.blockchainHistoryData[2]['historyPrices'][2], this.blockchainHistoryData[2]['historyPrices'][3], this.blockchainHistoryData[2]['historyPrices'][4], this.blockchainHistoryData[2]['historyPrices'][5], this.blockchainHistoryData[2]['historyPrices'][6], this.blockchainHistoryData[2]['historyPrices'][7]],
            backgroundColor: [
              'rgba(255, 0, 100, 0.2)',
            ],
            borderColor: [
              'rgba(255, 0, 100, 1)',
            ],
          },
          {
            label: 'Binance Coin (BNB)',
            data: [this.blockchainHistoryData[3]['historyPrices'][0], this.blockchainHistoryData[3]['historyPrices'][1], this.blockchainHistoryData[3]['historyPrices'][2], this.blockchainHistoryData[3]['historyPrices'][3], this.blockchainHistoryData[3]['historyPrices'][4], this.blockchainHistoryData[3]['historyPrices'][5], this.blockchainHistoryData[3]['historyPrices'][6], this.blockchainHistoryData[3]['historyPrices'][7]],
            backgroundColor: [
              'rgba(255, 200, 0, 0.2)',
            ],
            borderColor: [
              'rgba(255, 200, 0, 1)',
            ],
          },
          {
            label: 'USD Coin (USDC)',
            data: [this.blockchainHistoryData[4]['historyPrices'][0], this.blockchainHistoryData[4]['historyPrices'][1], this.blockchainHistoryData[4]['historyPrices'][2], this.blockchainHistoryData[4]['historyPrices'][3], this.blockchainHistoryData[4]['historyPrices'][4], this.blockchainHistoryData[4]['historyPrices'][5], this.blockchainHistoryData[4]['historyPrices'][6], this.blockchainHistoryData[4]['historyPrices'][7]],
            backgroundColor: [
              'rgba(255, 0, 200, 0.2)',
            ],
            borderColor: [
              'rgba(255, 0, 200, 1)',
            ],
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'white'
            }
          },
          x: {
            ticks: {
              color: 'white'
            }
          }
        },
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'white'
            },
            position: 'top',
          }
        }
      }
    });
  }
}
