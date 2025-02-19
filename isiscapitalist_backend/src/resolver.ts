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
    this.service.updateWorld(world);
    this.service.saveWorld(user, world);
    console.log(world.lastupdate)
    return world;
  }
  @Mutation()
  async acheterQtProduit(
    @Args('user') user: string,
    @Args('id') id: number,
    @Args('quantite') quantite: number,
  ) {
    return this.service.acheterQtProduit(user, id, quantite);
  }

  @Mutation()
  async lancerProductionProduit(
    @Args('user') user: string,
    @Args('id') id: number,
  ) {
    return this.service.lancerProductionProduit(user, id);
  }

  @Mutation()
  async engagerManager(@Args('user') user: string, @Args('name') name: string) {
    return this.service.engagerManager(user, name);
  }
}
