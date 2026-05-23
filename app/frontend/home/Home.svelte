<div>
  <h4>Today's tournaments</h4>
  Tournaments go here
</div>

<div class="mt-2">
  <form
    action="/tournaments/shortlink"
    method="get"
    class="form-inline justify-content-center"
  >
    <label class="mx-2" for="slug">Got a shortcode?</label>
    <input
      type="text"
      class="form-control mr-2"
      placeholder="SHRT"
      name="slug"
      id="slug"
    />
    <button type="submit" class="btn btn-primary mr-2">
      <i class="fa fa-arrow-right"></i>
      Go to tournament
    </button>
  </form>
</div>

<div class="mt-3 text-center">
  <p>
    <a href="/beta/tournaments" class="btn btn-primary">
      <i class="fa fa-users"></i>
      More tournaments
    </a>
  </p>
</div>
