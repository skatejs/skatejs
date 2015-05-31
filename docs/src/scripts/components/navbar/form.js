import shade from '../../../../../node_modules/shadejs/src/index';
import skate from '../../../../../src/index';
import AttrPosition from '../../attributes/position';

export default skate('skate-navbar-form', {
  attributes: {
    position: new AttrPosition({ prefix: 'navbar-', value: 'right' })
  },
  template: shade(`
    <form class="navbar-form" role="search">
      <div class="form-group">
        <content name="field">
          <input type="text" class="form-control" placeholder="Search">
        </content>
      </div>
      <content name="button" select="button">
        <button type="submit" class="btn btn-default">Submit</button>
      </content>
    </form>
  `)
});
