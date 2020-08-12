import { CModule, Module } from '../../arc-hv/core/module';
import { MainController } from './controllers/main.controller';
import { GuardController } from './controllers/guard.controller';
import { Guard } from './middleware/auth1.guard';


@Module({
    controllers: [
        MainController,
        GuardController
    ]
})
export class MainModule extends CModule {
}