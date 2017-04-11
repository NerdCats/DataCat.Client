import { UiRegistryService } from './ui-registry.service';
import { DataConverterService } from './data-converter.service';

export const UI_TOOLBOX_PROVIDERS: any[] = [
    { provide: UiRegistryService, useClass: UiRegistryService },
    { provide: DataConverterService, useClass: DataConverterService }
];
