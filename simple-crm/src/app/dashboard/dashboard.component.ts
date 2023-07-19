import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogLogInComponent } from '../dialog-log-in/dialog-log-in.component';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../shared.service';
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { Firestore, collection, docData, getDocs } from '@angular/fire/firestore';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private sharedService: SharedService, private firestore: Firestore) { }

  db = this.firestore;
  id: any;
  name: string | undefined;

  latestExpense:any = [
    {"latestTimestamp": 0},
    {"latestFirstName": null},
    {"latestLastName": null},
    {"latestAmount": 0},
    {"latestCategory": null},
    {"latestNote": null},
  ];

  expenses: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  income: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  monthAmount:any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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

  ngOnInit(): void {
    this.loadContent();
  }

  loadTestChart() {
    var myChart = new Chart("myChart", {
      type: 'line',
      data: {
        labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        
        datasets: [{
          label: 'expenses in €',
          data: [this.expenses[0], this.expenses[1], this.expenses[2], this.expenses[3], this.expenses[4], this.expenses[5], this.expenses[6], this.expenses[7], this.expenses[8], this.expenses[9], this.expenses[10], this.expenses[11]],
          backgroundColor: [
            'rgba(255, 0, 0, 0.2)', // Neue Hintergrundfarbe für Einnahmen (rot mit geringer Deckkraft)
          'rgba(0, 255, 0, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        },
        {
          label: 'income in €',
          data: [this.income[0], this.income[1], this.income[2], this.income[3], this.income[4], this.income[5], this.income[6], this.income[7], this.income[8], this.income[9], this.income[10], this.income[11]],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        
          
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'white' // Schriftfarbe auf Weiß setzen
            }
          },
          x: {
            ticks: {
              color: 'white' // Schriftfarbe auf Weiß setzen
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'white' // Schriftfarbe in der Legende auf Weiß setzen
            }
          }
        }
      }
    });
  }

  loadContent() {
    let id = this.sharedService.getCurrentUserId();
    if (id !== undefined) {
      docData(doc(this.firestore, `users/${id}`)).subscribe((user) => {
        this.name = user['firstName'];
        console.log(this.name);
        this.id = id;
      });

      this.calcExpenses();
      // this.calcIncome();
    } else {
      this.dialog.open(DialogLogInComponent);
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
    // this.loadLatestExpense();
  }

  calcMonthOverview(category:any, amount:any){
    for (let j = 0; j < this.expensesJSON[0].length; j++) {
      if (this.expensesJSON[0][j]['category'] == category) {
        this.expensesJSON[0][j]['amount'] += +amount;
        this.monthAmount[j] += +amount;
      }  
    }
  }

  

  loadLatestExpense(){

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
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }] 
      },
      options: {
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
}
