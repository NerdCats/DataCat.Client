import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

// Local Modules
import { NavbarModule } from '../navbar/index';
import { LetterAvatarModule } from '../shared/letter-avatar/index';
import { DataModule } from '../data/index';
import { UiToolboxModule } from '../ui-toolbox/index';

import { DASHBOARD_PROVIDERS } from './dashboard-event.service';

// Local Components
import { DashboardComponent } from './index';
import { SidebarComponent } from '../sidebar/index';
import { FooterComponent } from '../footer/index';
import { DashviewHeaderComponent } from '../dashview-header/index';
import { BrowseDashboardComponent } from '../browse-dashboard/index';

@NgModule({
    declarations: [
        DashboardComponent,
        SidebarComponent,
        FooterComponent,
        DashviewHeaderComponent,
        BrowseDashboardComponent
    ],
    exports: [
        DashboardComponent,
    ],
    imports: [
        RouterModule,
        CommonModule,
        NavbarModule,
        LetterAvatarModule,
        HttpModule,
        DataModule,
        UiToolboxModule
    ],
    providers: [...DASHBOARD_PROVIDERS]
})
export class DashboardModule {
}
