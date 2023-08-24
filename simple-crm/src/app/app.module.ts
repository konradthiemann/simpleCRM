import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogAddUserComponent } from './dialog-add-user/dialog-add-user.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore, collection } from '@angular/fire/firestore';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore/';
import { AngularFireModule } from '@angular/fire/compat';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { MatMenuModule } from '@angular/material/menu';
import { DialogEditAddressComponent } from './dialog-edit-address/dialog-edit-address.component';
import { DialogEditUserComponent } from './dialog-edit-user/dialog-edit-user.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DialogDeleteUserComponent } from './dialog-delete-user/dialog-delete-user.component';
import { DialogLogInComponent } from './dialog-log-in/dialog-log-in.component';
import { DialogLogInSuccessfulComponent } from './dialog-log-in-successful/dialog-log-in-successful.component';
import { SharedService } from './shared.service';
import { DialogAddFinanceComponent } from './dialog-add-finance/dialog-add-finance.component';
import { DialogAddFinanceSuccessfulComponent } from './dialog-add-finance-successful/dialog-add-finance-successful.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DialogForgotPasswordComponent } from './dialog-forgot-password/dialog-forgot-password.component';
import { HttpClientModule } from '@angular/common/http';
import { DialogChangePasswordComponent } from './dialog-change-password/dialog-change-password.component';
import { DialogChangePasswordSuccessfulComponent } from './dialog-change-password-successful/dialog-change-password-successful.component';
import { DialogShowNoteComponent } from './dialog-show-note/dialog-show-note.component';
import { LogInComponent } from './log-in/log-in.component';
import { DialogShowInfoComponent } from './dialog-show-info/dialog-show-info.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UserComponent,
    DialogAddUserComponent,
    UserDetailComponent,
    DialogEditAddressComponent,
    DialogEditUserComponent,
    LegalNoticeComponent,
    PrivacyPolicyComponent,
    DialogDeleteUserComponent,
    DialogLogInComponent,
    DialogLogInSuccessfulComponent,
    DialogAddFinanceComponent,
    DialogAddFinanceSuccessfulComponent,
    DialogForgotPasswordComponent,
    DialogChangePasswordComponent,
    DialogChangePasswordSuccessfulComponent,
    DialogShowNoteComponent,
    LogInComponent,
    DialogShowInfoComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    MatProgressBarModule,
    MatCardModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    MatMenuModule,
    MatSelectModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    SharedService,
    DashboardComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
