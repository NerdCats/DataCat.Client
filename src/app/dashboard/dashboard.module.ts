import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

// Load Controls
import { ChartsModule } from 'ng2-charts';
import { SelectModule } from 'ng2-select';
// import { CalendarModule } from 'primeng/primeng';

// Local Modules
import { NavbarModule } from '../navbar/index';
import { LetterAvatarModule } from '../shared/letter-avatar/index';
import { DataModule } from '../data/index';


import { DASHBOARD_PROVIDERS } from './dashboard-event.service';

// Local Components
import { DashboardComponent } from './index';
import { SidebarComponent } from '../sidebar/index';
import { FooterComponent } from '../footer/index';
import { DashviewHeaderComponent } from '../dashview-header/index';
import { GlimpseComponent } from '../glimpse/index';
import { AttemptVsDeliveryComponent } from '../attempt-vs-delivery/index';
import { VendorOrderFrequencyComponent } from '../vendor-order-frequency/index';

@NgModule({
    declarations: [
        DashboardComponent,
        SidebarComponent,
        FooterComponent,
        DashviewHeaderComponent,
        GlimpseComponent,
        AttemptVsDeliveryComponent,
        VendorOrderFrequencyComponent
    ],
    exports: [
        DashboardComponent,
    ],
    imports: [
        RouterModule,
        CommonModule,
        NavbarModule,
        LetterAvatarModule,
        ChartsModule,
        HttpModule,
        DataModule,
        SelectModule,
        // CalendarModule,
    ],
    providers: [...DASHBOARD_PROVIDERS]
})
export class DashboardModule {
}
