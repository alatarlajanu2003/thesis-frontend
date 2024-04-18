import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { HomeComponent } from './components/home/home.component';
import { FlatCreationComponent } from './components/flat-creation/flat-creation.component';
import { FlatDetailsComponent } from './components/flat-details/flat-details.component';
import { AcceptInvitationComponent } from './components/accept-invitation/accept-invitation.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'home', component: HomeComponent },
    { path: 'flat-creation', component: FlatCreationComponent },
    { path: 'flat-details/:flatId', component: FlatDetailsComponent },
    { path: 'accept-invitation/:token', component: AcceptInvitationComponent }
];
