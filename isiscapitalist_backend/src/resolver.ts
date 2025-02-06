import { origworld } from './origworld';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service';
import { Palier } from './graphql';
@Resolver('World')
export class GraphQlResolver {
constructor(private service: AppService) {}
@Query()
async getWorld(@Args('user') user: string) {
const world = this.service.readUserWorld(user);
return world;
}
}
