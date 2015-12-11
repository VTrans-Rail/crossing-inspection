function HelpButton(){
	ga('send', 'event', { eventCategory: 'Help', eventAction: 'Click', eventLabel: 'Help button click'});
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
							<h3 class="subtitle"><small>Here's how it works:</small></h3>
						</div>
					</div>

					<div class="inner cover">
						<div class="step">
							<span class="searchIcon esri-icon-search" id="searchico"> </span>
							<strong>
								Search for:
							</strong>
						</div>
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
						<div class="step">
							<span class="searchIcon esri-icon-zoom-out-fixed"> </span>
							<strong>
								Use the map
							</strong>
						</div>
						<p>
							<em>
								Navigate the map to your desired area.
							</em>
						</p>
						<div class="horiz-line">
							<span class="divider-text">
								<em>then</em>
							</span>
						</div>

						<p>
						<img src="img\\\x63rossing-good.png" alt="" id="xingImg"/>
						<em>
							Click on a crossing to see details
						</em>
						</p>
						<p>
							<em>This button opens the crossing report page:</em>
						</p>
						<p>
							<button type="button" class="btn btn-sm btn-default btn-report" id="helpRptBtn">Full Report</button>
						</p>
					</div>
					<div class="mastfoot">

					<div class="inner cover gotit">
							<a href="#" onclick="return HelpButton();"class="btn btn-lg btn-success">Got it!</a>
					</div>
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
