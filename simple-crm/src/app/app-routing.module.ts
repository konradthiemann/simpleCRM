import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DialogLogInComponent } from './dialog-log-in/dialog-log-in.component';

const routes: Routes = [
  {path:'', component: DashboardComponent},
  {path:'dashboard/:id', component: DashboardComponent},
  {path:'user', component: UserComponent},
  {path:'user/:id', component: UserDetailComponent},
  {path:'legal-notice', component: LegalNoticeComponent},
  {path:'privacy-policy', component: PrivacyPolicyComponent},
  {path:'log-in', component: DialogLogInComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
