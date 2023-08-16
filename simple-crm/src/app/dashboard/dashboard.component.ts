import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogLogInComponent } from '../dialog-log-in/dialog-log-in.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { Firestore, collection, docData, getDocs, onSnapshot } from '@angular/fire/firestore';
import { Chart, registerables } from 'chart.js';
import { DialogAddFinanceComponent } from '../dialog-add-finance/dialog-add-finance.component';
import { User } from '../models/user.class';
import { single, Observable, of } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private firestore: Firestore,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.createBlockchainJson();
    this.createBlockchainHistoryJson();
    this.loadContent();
    this.getNextBirthdays();
  }


  // test: any = '2';

  birthdays: any[] = [];
  birthdays$?: Observable<any[]>;

  db = this.firestore;
  id: any;
  name: string | undefined;
  user: User = new User;

  totalMonthIncomes: any = 0;
  totalMonthExpenses: any = 0;
  totalYearExpenses: any = 0;
  totalYearIncome: any = 0;


  API_URL: string = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Ctether%2Cbinancecoin%2Cusd-coin%2Cripple&vs_currencies=eur';
  API_HISTORY_URL: string = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=eur&days=7&interval=daily';
  blockchainData: any;
  blockchainNames: any = ['bitcoin', 'ethereum', 'tether', 'binancecoin', 'usd-coin', 'ripple'];
  blockchainDays: any = [null, null, null, null, null, null, null, null];
  blockchainPrices: any = [
    { 'bitcoin': null },
    { 'ethereum': null },
    { 'tether': null },
    { 'binancecoin': null },
    { 'usd-coin': null },
    { 'ripple': null }
  ];

  blockchainHistory: any = [
    { 'bitcoin': null },
    { 'ethereum': null },
    { 'tether': null },
    { 'binancecoin': null },
    { 'usd-coin': null },
    { 'ripple': null }
  ];

  latestExpense: any = [];
  latestExpense$?: Observable<any[]>;
  latestIncome: any = [];
  latestIncome$?: Observable<any[]>;

  expenses: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  income: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  monthAmount: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  monthAmountIncomes: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  expensesJSON: any = [
    [
      { "category": "Salaries", "amount": 0 },
      { "category": "Hardware and Computing Resources", "amount": 0 },
      { "category": "Electricity Costs", "amount": 0 },
      { "category": "Research and Development", "amount": 0 },
      { "category": "Security Measures", "amount": 0 },
      { "category": "Legal Consultation", "amount": 0 },

    ]
  ]

  incomesJSON: any = [
    [
      { "category": "Crypto Consulting Services", "amount": 0 },
      { "category": "Blockchain Development Services", "amount": 0 },
      { "category": "Crypto Mining", "amount": 0 },
      { "category": "ICO/STO Consulting", "amount": 0 },
      { "category": "Project Implementation", "amount": 0 },

    ]
  ]


  loadContent() {
    let id = this.sharedService.getCurrentUserId();
    if (id !== undefined) {
      docData(doc(this.firestore, `users/${id}`)).subscribe((user) => {
        this.name = user['firstName'];
        this.id = id;
      });

      onSnapshot(collection(this.firestore, `finances`), () => {
        this.calcExpenses();
      });

      // this.calcExpenses();
    } else {
      this.router.navigate(['/log-in']);
    }
  }

  async calcExpenses() {
    this.expenses = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.income = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const db = getFirestore();
    const colRef = collection(db, "finances");
    const docsSnap = await getDocs(colRef);

    for (let i = 0; i < 11; i++) {
      this.latestExpense = [];
      this.latestIncome = [];
      docsSnap.forEach(doc => {
        let dateTimestamp = doc.get('date');
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

        if (currentYear == year && currentMonth == month && transaction == 'expense' && i == 10) {
          this.calcMonthExpenseOverview(category, amount)
        }

        if (currentYear == year && currentMonth == month && transaction == 'income' && i == 10) {
          this.calcMonthIncomeOverview(category, amount)
        }

        if (transaction == 'expense' && i == 10) {
          const newExpense = {
            "latestDateTimestamp": dateTimestamp,
            "latestTimestamp": timestamp,
            "latestFirstName": firstName,
            "latestLastName": lastName,
            "latestAmount": amount,
            "latestCategory": category,
            "latestNote": note,
          };

          this.latestExpense.push([newExpense]);
        }

        if (transaction == 'income' && i == 10) {
          const newIncome = {
            "latestDateTimestamp": dateTimestamp,
            "latestTimestamp": timestamp,
            "latestFirstName": firstName,
            "latestLastName": lastName,
            "latestAmount": amount,
            "latestCategory": category,
            "latestNote": note,
          };
          this.latestIncome.push([newIncome]);
        }

      });

      this.sortLatestExpense(this.latestExpense);
      this.sortLatestExpense(this.latestIncome);

      this.totalYearExpenses = this.formatNumberWithDots(this.expenses.reduce((a: any, b: any) => a + b, 0));
      this.totalYearIncome = this.formatNumberWithDots(this.income.reduce((a: any, b: any) => a + b, 0));

    }
    
    this.latestExpense$ = of(this.latestExpense);
    this.latestIncome$ = of(this.latestIncome);
    console.log(this.latestExpense,this.latestExpense$, 'latestExpense');
    console.log(this.latestIncome,this.latestIncome$, 'latestIncome');

    this.loadTestChart();
    this.loadPieChart();
    this.loadPieChartIncomes();
  }

  sortLatestExpense(transaction: any) {
    transaction.sort((a: any, b: any) => {
      let timestampA = a[0].latestDateTimestamp;
      let timestampB = b[0].latestDateTimestamp;
      return timestampA - timestampB;
    });
    
    this.latestExpense = this.latestExpense.reverse();
    this.latestIncome = this.latestIncome.reverse();
    this.latestExpense = this.latestExpense.slice(0, 3);
    this.latestIncome = this.latestIncome.slice(0, 3);
    // transaction = transaction.slice(0, 3);
  }

  calcMonthExpenseOverview(category: any, amount: any) {
    for (let j = 0; j < this.expensesJSON[0].length; j++) {
      if (this.expensesJSON[0][j]['category'] == category) {
        this.expensesJSON[0][j]['amount'] += +amount;
        this.monthAmount[j] += +amount;
      }
    }
    this.totalMonthExpenses = this.formatNumberWithDots(this.monthAmount.reduce((a: any, b: any) => a + b, 0));
  }

  calcMonthIncomeOverview(category: any, amount: any) {
    for (let j = 0; j < this.incomesJSON[0].length; j++) {
      if (this.incomesJSON[0][j]['category'] == category) {
        this.incomesJSON[0][j]['amount'] += +amount;
        this.monthAmountIncomes[j] += +amount;
      }
    }
    this.totalMonthIncomes = this.formatNumberWithDots(this.monthAmountIncomes.reduce((a: any, b: any) => a + b, 0));
  }

  formatNumberWithDots(number: any) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  loadLatestExpense() {
  }

  pieChart: any;
  pieChartIncomes: any;

  loadPieChart() {
    if (this.pieChart != undefined) {
      this.pieChart.destroy();
    }
    this.pieChart = new Chart("myChartPie", {
      type: 'doughnut',
      data: {
        labels: [
          'Salaries',
          'Hardware and Computing Resources',
          'Electricity Costs',
          'Research and Development',
          'Security Measures',
          'Legal Consultation',
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
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'black'
            }
          }
        }
      }
    });
  }

  loadPieChartIncomes() {
    if (this.pieChartIncomes != undefined) {
      this.pieChartIncomes.destroy();
    }
    this.pieChartIncomes = new Chart("myChartPieIncomes", {
      type: 'doughnut',
      data: {
        labels: [
          'Crypto Consulting Services',
          'Blockchain Development Services',
          'Crypto Mining',
          'ICO/STO Consulting',
          'Project Implementation',
        ],
        datasets: [{
          label: 'Month overview',
          data: [
            this.monthAmountIncomes[0],
            this.monthAmountIncomes[1],
            this.monthAmountIncomes[2],
            this.monthAmountIncomes[3],
            this.monthAmountIncomes[4],
            this.monthAmountIncomes[5],
            this.monthAmountIncomes[6],
            this.monthAmountIncomes[7],
            this.monthAmountIncomes[8],
            this.monthAmountIncomes[9],
            this.monthAmountIncomes[10],
            this.monthAmountIncomes[11],
            this.monthAmountIncomes[12],
            this.monthAmountIncomes[13],
            this.monthAmountIncomes[14],
            this.monthAmountIncomes[15],
            this.monthAmountIncomes[16],
            this.monthAmountIncomes[17],
          ],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(64, 102, 86)',
            'rgb(5, 23, 86)',
            'rgb(231, 78, 222)',
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'black'
            }
          }
        }
      }
    });
  }

  myChart: any;

  loadTestChart() {
    if (this.myChart != undefined) {
      this.myChart.destroy();
    }
    this.myChart = new Chart("myChart", {
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
              color: 'black'
            }
          },
          x: {
            ticks: {
              color: 'black'
            }
          }
        },
        // indexAxis: 'y',
        elements: {
          bar: {
            borderWidth: 2,

          }
        },
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'black'
            },
            position: 'top',
          },
        }
      },
    });
  }

  openAddFinanceDialog(id: any) {
    const dialog = this.dialog.open(DialogAddFinanceComponent);
    dialog.componentInstance.userId = this.id;
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.disableSelection = false;
  }
  //Blockchain

  async createBlockchainJson() {
    let response = await fetch(this.API_URL);
    let blockchainApi = await response.json();
    this.blockchainData = blockchainApi;
    this.blockchainPrices[0] = this.blockchainData['bitcoin']['eur'];
    this.blockchainPrices[1] = this.blockchainData['ethereum']['eur'];
    this.blockchainPrices[2] = this.blockchainData['tether']['eur'];
    this.blockchainPrices[3] = this.blockchainData['binancecoin']['eur'];
    this.blockchainPrices[4] = this.blockchainData['usd-coin']['eur'];
    this.blockchainPrices[5] = this.blockchainData['ripple']['eur'];
    this.loadBlockchainChart();
    // console.log(this.blockchainPrices, 'blockchainPrices');

  }

  async createBlockchainHistoryJson() {
    for (let i = 0; i < this.blockchainNames.length; i++) {
      let response = await fetch(`https://api.coingecko.com/api/v3/coins/${this.blockchainNames[i]}/market_chart?vs_currency=eur&days=7&interval=daily`)
      let blockchainApi = await response.json();
      this.blockchainHistory[i] = blockchainApi;
      
      this.getHistoryDate(this.blockchainHistory);
    }
    this.getHistoryData(this.blockchainHistory);
  }

  getHistoryDate(history: any) {
    for (let i = 0; i < history[0]['prices'].length; i++) {

      var newDate = new Date(history[0]['prices'][i][0]);
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var year = newDate.getFullYear();
      var month = months[newDate.getMonth()];
      var date = newDate.getDate();
      var time = date + ' ' + month + ' ' + year;

      this.blockchainDays[i] = time;
    }
  }

  getHistoryData(history: any) {
    for (let i = 0; i < history.length; i++) {
      this.getSingleHistoryDataSet(history[i], i);
    }
    this.loadBlockchainChartHistoryBitcoin();
    this.loadBlockchainChartHistoryEthereum();
    this.loadBlockchainChartHistoryTether();
    this.loadBlockchainChartHistoryBinanceCoin();
    this.loadBlockchainChartHistoryUSDCoin();
    this.loadBlockchainChartHistoryXRP();
  }

  blockchainHistoryData: any = [
    { 'historyPrices': [] },
    { 'historyPrices': [] },
    { 'historyPrices': [] },
    { 'historyPrices': [] },
    { 'historyPrices': [] },
    { 'historyPrices': [] },
  ];

  getSingleHistoryDataSet(history: any, j: any) {
    for (let i = 0; i < history['prices'].length; i++) {
      this.blockchainHistoryData[j]['historyPrices'][i] = history['prices'][i][1];
    }
    // console.log(this.blockchainHistoryData );
  }

  blockchainChart: any;


  loadBlockchainChart() {
    if (this.blockchainChart != undefined) {
      this.blockchainChart.destroy();
    }
    this.blockchainChart = new Chart("myBlockchainChart", {
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
        },
        {
          label: 'Ripple (XRP)',
          data: [this.blockchainPrices[4]],
          backgroundColor: [
            'rgba(255, 17, 200, 0.2)',
          ],
          borderColor: [
            'rgba(255, 17, 200, 1)',
          ],
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'black'
            }
          },
          x: {
            ticks: {
              color: 'black'
            }
          }
        },
        indexAxis: 'x',
        elements: {
          bar: {
            borderWidth: 2,

          }
        },
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'black'
            },
            position: 'top',
          },
        }
      },
    });
  }

  blockchainChartHistoryBitcoin: any;

  loadBlockchainChartHistoryBitcoin() {
    if (this.blockchainChartHistoryBitcoin != undefined) {
      this.blockchainChartHistoryBitcoin.destroy();
    }
    this.blockchainChartHistoryBitcoin = new Chart("myBlockchainChartHistoryBitcoin", {
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
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'black'
            }
          },
          x: {
            ticks: {
              color: 'black'
            }
          }
        },
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'black'
            },
            position: 'top',
          }
        }
      }
    });

    console.log("Chart instance created:", this.blockchainChartHistoryBitcoin);

  }

  blockchainChartHistoryEthereum: any;

  loadBlockchainChartHistoryEthereum() {
    if (this.blockchainChartHistoryEthereum != undefined) {
      this.blockchainChartHistoryEthereum.destroy();
    }
    this.blockchainChartHistoryEthereum = new Chart("myBlockchainChartHistoryEthereum", {
      type: 'line',
      data: {
        labels: [this.blockchainDays[0], this.blockchainDays[1], this.blockchainDays[2], this.blockchainDays[3], this.blockchainDays[4], this.blockchainDays[5], this.blockchainDays[6]],
        datasets: [
          {
            label: 'Ethereum (ETH)',
            data: [this.blockchainHistoryData[1]['historyPrices'][0], this.blockchainHistoryData[1]['historyPrices'][1], this.blockchainHistoryData[1]['historyPrices'][2], this.blockchainHistoryData[1]['historyPrices'][3], this.blockchainHistoryData[1]['historyPrices'][4], this.blockchainHistoryData[1]['historyPrices'][5], this.blockchainHistoryData[1]['historyPrices'][6], this.blockchainHistoryData[1]['historyPrices'][7]],
            backgroundColor: [
              'rgba(255, 100, 0, 0.2)',
            ],
            borderColor: [
              'rgba(255, 100, 0, 1)',
            ],
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'black'
            }
          },
          x: {
            ticks: {
              color: 'black'
            }
          }
        },
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'black'
            },
            position: 'top',
          }
        }
      }
    });
  }

  blockchainChartHistoryTether: any;

  loadBlockchainChartHistoryTether() {
    if (this.blockchainChartHistoryTether != undefined) {
      this.blockchainChartHistoryTether.destroy();
    }
    this.blockchainChartHistoryTether = new Chart("myBlockchainChartHistoryTether", {
      type: 'line',
      data: {
        labels: [this.blockchainDays[0], this.blockchainDays[1], this.blockchainDays[2], this.blockchainDays[3], this.blockchainDays[4], this.blockchainDays[5], this.blockchainDays[6]],
        datasets: [
          {
            label: 'Tether (USDT)',
            data: [this.blockchainHistoryData[2]['historyPrices'][0], this.blockchainHistoryData[2]['historyPrices'][1], this.blockchainHistoryData[2]['historyPrices'][2], this.blockchainHistoryData[2]['historyPrices'][3], this.blockchainHistoryData[2]['historyPrices'][4], this.blockchainHistoryData[2]['historyPrices'][5], this.blockchainHistoryData[2]['historyPrices'][6], this.blockchainHistoryData[2]['historyPrices'][7]],
            backgroundColor: [
              'rgba(255, 0, 100, 0.2)',
            ],
            borderColor: [
              'rgba(255, 0, 100, 1)',
            ],
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'black'
            }
          },
          x: {
            ticks: {
              color: 'black'
            }
          }
        },
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'black'
            },
            position: 'top',
          }
        }
      }
    });
  }

  blockchainChartHistoryBinanceCoin: any;

  loadBlockchainChartHistoryBinanceCoin() {
    if (this.blockchainChartHistoryBinanceCoin != undefined) {
      this.blockchainChartHistoryBinanceCoin.destroy();
    }
    this.blockchainChartHistoryBinanceCoin = new Chart("myBlockchainChartHistoryBinanceCoin", {
      type: 'line',
      data: {
        labels: [this.blockchainDays[0], this.blockchainDays[1], this.blockchainDays[2], this.blockchainDays[3], this.blockchainDays[4], this.blockchainDays[5], this.blockchainDays[6]],
        datasets: [
          {
            label: 'Binance Coin (BNB)',
            data: [this.blockchainHistoryData[3]['historyPrices'][0], this.blockchainHistoryData[3]['historyPrices'][1], this.blockchainHistoryData[3]['historyPrices'][2], this.blockchainHistoryData[3]['historyPrices'][3], this.blockchainHistoryData[3]['historyPrices'][4], this.blockchainHistoryData[3]['historyPrices'][5], this.blockchainHistoryData[3]['historyPrices'][6], this.blockchainHistoryData[3]['historyPrices'][7]],
            backgroundColor: [
              'rgba(255, 200, 0, 0.2)',
            ],
            borderColor: [
              'rgba(255, 200, 0, 1)',
            ],
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'black'
            }
          },
          x: {
            ticks: {
              color: 'black'
            }
          }
        },
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'black'
            },
            position: 'top',
          }
        }
      }
    });
  }

  blockchainChartHistoryUSDCoin: any;

  loadBlockchainChartHistoryUSDCoin() {
    if (this.blockchainChartHistoryUSDCoin != undefined) {
      this.blockchainChartHistoryBitcoin.destroy();
    }
    this.blockchainChartHistoryUSDCoin = new Chart("myBlockchainChartHistoryUSDCoin", {
      type: 'line',
      data: {
        labels: [this.blockchainDays[0], this.blockchainDays[1], this.blockchainDays[2], this.blockchainDays[3], this.blockchainDays[4], this.blockchainDays[5], this.blockchainDays[6]],
        datasets: [
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
              color: 'black'
            }
          },
          x: {
            ticks: {
              color: 'black'
            }
          }
        },
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'black'
            },
            position: 'top',
          }
        }
      }
    });
  }

  blockchainChartHistoryXRP: any;

  loadBlockchainChartHistoryXRP() {
    if (this.blockchainChartHistoryXRP != undefined) {
      this.blockchainChartHistoryXRP.destroy();
    }

    this.blockchainChartHistoryXRP = new Chart("myBlockchainChartHistoryXRP", {
      type: 'line',
      data: {
        labels: [this.blockchainDays[0], this.blockchainDays[1], this.blockchainDays[2], this.blockchainDays[3], this.blockchainDays[4], this.blockchainDays[5], this.blockchainDays[6]],
        datasets: [
          {
            label: 'Ripple (XRP)',
            data: [this.blockchainHistoryData[5]['historyPrices'][0], this.blockchainHistoryData[5]['historyPrices'][1], this.blockchainHistoryData[5]['historyPrices'][2], this.blockchainHistoryData[5]['historyPrices'][3], this.blockchainHistoryData[5]['historyPrices'][4], this.blockchainHistoryData[5]['historyPrices'][5], this.blockchainHistoryData[5]['historyPrices'][6], this.blockchainHistoryData[5]['historyPrices'][7]],
            backgroundColor: [
              'rgba(255, 17, 200, 0.2)',
            ],
            borderColor: [
              'rgba(255, 17, 200, 1)',
            ],
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'black'
            }
          },
          x: {
            ticks: {
              color: 'black'
            }
          }
        },
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: 'black'
            },
            position: 'top',
          }
        }
      }
    });
  }

  async getNextBirthdays() {
    const db = getFirestore();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const colRef = collection(db, "users");
    const docsSnap = await getDocs(colRef);

    for (let i = 0; i < 2; i++) {
      docsSnap.forEach(doc => {
        let firstName = doc.get('firstName');
        let lastName = doc.get('lastName');
        let birthDate = new Date(doc.get('birthDate'));

        if (birthDate.getFullYear() < today.getFullYear()) {
          birthDate.setFullYear(today.getFullYear() + i);
        }

        if (birthDate > today) {
          this.birthdays.push([firstName, lastName, birthDate]);
        }
      });
    }

    this.sortBirthdays();
    this.birthdays$ = of(this.birthdays);
  }

  sortBirthdays() {
    this.birthdays.sort((a, b) => {
      let dateA = new Date(a[2]);
      let dateB = new Date(b[2]);
      return dateA.getTime() - dateB.getTime();
    });
    this.birthdays = this.birthdays.slice(0, 3);
    // console.log(this.birthdays);
  }

}
