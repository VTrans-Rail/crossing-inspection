function clicker(){
	var thediv=document.getElementById('instructions');
	if(thediv.style.display == "none"){
		thediv.style.display = "";
		thediv.innerHTML = `
		<div class="site-wrapper">

      <div class="site-wrapper-inner">

        <div class="cover-container">

          <div class="masthead clearfix">
            <div class="inner">
              <h3 class="masthead-brand">Crossing Inspection</h3>
              <h3><small>Data Investigation App</small></h3>
            </div>
          </div>

          <div class="inner cover">
            <h1 class="cover-heading">Here's how it works</h1>
            <p class="lead">
              First, do the thing.
            </p>
            <p>
              Then the next step is this.
            </p>
            <p>
              Finally, click.
            </p>
          </div>
          <div class="inner cover">
            <p class="lead">
              <a href="#" onclick="return clicker();"class="btn btn-lg btn-success">Got it!</a>
            </p>
          </div>


        </div>

      </div>

    </div>
		`;
	}else{
		thediv.style.display = "none";
		thediv.innerHTML = '';
	}
	return false;
}
