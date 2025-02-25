import { origworld } from './origworld';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service';
import { Palier ,World} from './graphql';

@Resolver('World')
export class GraphQlResolver {
  constructor(private service: AppService) { }
  @Query()
  async getWorld(@Args('user') user: string) {
    const world = this.service.readUserWorld(user);
    this.service.updateWorld(world);
    this.service.saveWorld(user, world);
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
  @Mutation()
  async acheterCashUpgrade(@Args('user') user: string, @Args('name') name: string) {
    return this.service.acheterCashUpgrade(user, name);
  }
  @Mutation()
  async acheterAngelUpgrade(@Args('user') user: string, @Args('name') name: string) {
    return this.service.acheterAngelUpgrade(user, name);
  }
  @Mutation()
  async resetWorld(@Args('user') user: string): Promise<World> {
    return this.service.worldReset(user);
  }
}
