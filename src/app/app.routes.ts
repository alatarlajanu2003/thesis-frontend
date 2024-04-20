import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { HomeComponent } from './components/home/home.component';
import { FlatCreationComponent } from './components/flat-creation/flat-creation.component';
import { FlatDetailsComponent } from './components/flat-details/flat-details.component';
import { AcceptInvitationComponent } from './components/accept-invitation/accept-invitation.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { PaymentDetailsComponent } from './components/payment-details/payment-details.component';
import { authGuard } from './guards/auth.guard';
import { PaymentCreationComponent } from './components/payment-creation/payment-creation.component';
import { ReadingDetailsComponent } from './components/reading-details/reading-details.component';
import { ReadingCreationComponent } from './components/reading-creation/reading-creation.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'flat-creation', component: FlatCreationComponent, canActivate: [authGuard] },
    { path: 'flat-details/:flatId', component: FlatDetailsComponent, canActivate: [authGuard] },
    { path: 'accept-invitation/:token', component: AcceptInvitationComponent },
    { path: 'user-details', component: UserDetailsComponent, canActivate: [authGuard] },
    { path: 'payment-details/:flatId', component: PaymentDetailsComponent, canActivate: [authGuard] },
    { path: 'payment-creation/:flatId', component: PaymentCreationComponent, canActivate: [authGuard] },
    { path: 'reading-details/:flatId', component: ReadingDetailsComponent, canActivate: [authGuard] },
    { path: 'reading-creation/:flatId', component: ReadingCreationComponent, canActivate: [authGuard] }
];
