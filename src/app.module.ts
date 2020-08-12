import { CModule, Module } from "./arc-hv/core/module";
import { MainModule } from "./app/main/main.module";


@Module({
    modules: [
        MainModule
    ],
    //view : 'views',
    assets: [
        { src: 'assets', dest: '/' }
    ]
})
export class AppModule extends CModule {}