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
							<h2 class="masthead-brand">Crossing Inspection</h2>
							<h3 class="subtitle"><em>Data Investigation App</em></h3>
							<h2 class="subtitle"><small>Here's how it works:</small></h2>
						</div>
					</div>

					<div class="inner cover">
						<p class="step">
							<span class="searchIcon esri-icon-search" id="searchico"> </span>
							<strong>
								Search for
							</strong>
						</p>
						<p>
							<ul class="list-inline">
								<li>DOT Number</li>
								<li>Town Name</li>
								<li>Road Name</li>
							</ul>
						</p>
						<div class="horiz-line">
							<span class="divider-text">
								<em>or</em>
							</span>
						</div>
						<p class="step">
							<span class="searchIcon esri-icon-zoom-out-fixed"> </span>
							<strong>
								Use the map
							</strong>
						</p>
						<p>
							<em>
								Navigate the map to your desired area.
							</em>
						</p>
					</div>
					<div class="inner cover gotit">
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
