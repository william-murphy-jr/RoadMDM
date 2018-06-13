/* 
 * by TLMWorks -- wmj
 * content-single-product-app.js ver 2.0 4.19.17
 * Turns woocommerce single page variations
 * into a single page mini-app.
 * Works w/content-single-product-tablet-app.php
 * which is called by single-product.php
 * Registered in functions.php 
 * Script only called if 
 * page  has_term('tablet', 'product_cat') ||
 * has_term('phone', 'product_cat') 
 */

;(function($, window, document, undefined) {
  console.log("HELLO I am a free single page mini-app 1 2 3 . . .");


  /****************  GLOBALS  ****************/
  var $table = $('table.variations');
  var $select = [];
  var attribute = [];
  var $hos_select_box;
  var $cartNav = $('.single-product-nav');
  var $button_submit = $('button[type="submit"]');

  /*  Interate thorough Plans */
  $table.find('select').each(function() {
    $select.push($(this));
  });

  //  Add a data attr & get the text of each select box
  var op1_title = $select[0].find('option:eq(1)').attr('data-tag', '1').text();
  var op2_title = $select[0].find('option:eq(2)').attr('data-tag', '2').text();
  var op3_title = $select[0].find('option:eq(3)').attr('data-tag', '3').text();

  // Initialize the Page
  function pageInit() {

    // Tag managed plans on page init
    $('#plan_1').attr('data-tag', 1);
    $('#plan_2').attr('data-tag', 2);
    $('#plan_3').attr('data-tag', 3);

    // Prevent order's of less than 0
     $('input[type="number"]').attr('min', '1');

    // Grab the select box text
    $('#plan_1 h4').text(op1_title);
    $('#plan_2 h4').text(op2_title);
    $('#plan_3 h4').text(op3_title);

    // Hide stuff we do not want
    $('div.product_meta').hide();
    $button_submit.hide();

    //Prevent double price from showing
    $('.woocommerce-variation-price').hide();
    $button_submit.text('NEXT - Accessories');
    $button_submit.attr('id','btn-next-accessories');

    // This cloned box will be shown on the HOS page
    $hos_select_box = $select[2].clone();
    $hos_select_box.attr('id', 'pa_hos_clone');
    $('#hos-select-drop-zone').append($hos_select_box);

    // Remove None from the cloned select box so it will not show up
    // as an option in the select box on the HOS page.
    $hos_select_box.find('option').eq(1).detach();

    // Add data tag to each HOS option for selection
    // With this we will need to add 1 to the index of the
    // data tag number to make it correlate with the hidden box
    // If the user selects 'Choose an option' this selects 'None' 
    // in the hidden HOS select box.
    $hos_select_box.find('option').each(function(index) {
      $(this).attr('data-tag', index + 1);
    });

    $button_submit
      .after('<a href="#" id="psuedo-add-to-cart-btn" class="button alt"><span>Add to cart</span></a>');

    // This add to cart button navigates to the next page
    $('#psuedo-add-to-cart-btn').on('click', function(e) {
      e.preventDefault();
      $cartNav.hide();
      $.scrollTo( '#page', 0);
      $('.qty-text').hide();
      $('#single-title').hide();
      $('.outside-detailed-description').hide();
      $('form.variations_form cart').hide();
      $('.single_variation').hide();
      $('#single-page-app-lowest-price').hide();
      $('div.summary.entry-summary').hide();
      $('.onsale').hide();

      $('.price-holder').hide();

      $('div.summary-list-box').hide();
      $('div[itemprop="description"]').hide();
      $('#psuedo-add-to-cart-btn').hide();
      $('div.data-plan-container').show();
     
      displayManagedPlans();
    });      
  } // End of pageInit()
  

  /*
   *  --------  Managed Data Plans  ----------
   */
  function displayManagedPlans() {
    var btn_NextMsp = $('#next-msp');

    // Highlight the default choice of Managed Data Plans
    // and return true if highlighted
    highLight();

    // Now show Managed Plans Page
    $('div.data-plan-container').show();

    // Find which plan has been selected and highLight
    $('div.plans').on('click', function(e) {
      var $this = $(this);
      var planChecked = $this.data('tag');

      btn_NextMsp.removeClass('disabled');

      // Highlight the selected plan      
      $this.addClass('active')
        .siblings().removeClass('active')
        .siblings().find('input').removeAttr('checked');
      $this.find('input').attr('checked', 'checked');

      // will change hidden original selected option
      if (planChecked > 0) {
        $select[0].each(function() {
          this.selectedIndex = planChecked;
        });
      }

    });  // end input div box event listner

    // Navigation - Return to the single product page
    $('.data-plan-container nav a.back-btn').on('click', function(e) {
      e.preventDefault();
      $cartNav.show();
      $('.qty-text').show();
      $('div.quantity input').show();
      $('p.price').show();
      $('div.images').show();
      $('div[itemprop="description"]').show();
      $('div.summary.entry-summary').show();
      $('div.summary.entry-summary').css({"padding-top": "3em"});
      $('div.summary-list-box').show();
      $('#psuedo-add-to-cart-btn').show();
      $('.summary-content-box.content-single-product').show();

      $('#single-title').show();
      $('.outside-detailed-description').show();
      $('form.variations_form cart').show();
      $('.single_variation').show();
      $('#single-page-app-lowest-price').show();
      $('.price-holder').show();
      $('.onsale').show();
      $('.price-holder').show();


      $('div.data-plan-container').hide();
    });

    // Navigation - Move on to MSP page
    btn_NextMsp.on('click', function(e) {
        e.preventDefault();
        $.scrollTo( '#page', 0);
        $('div.data-plan-container').hide();
        $('#psuedo-add-to-cart-btn').hide();
        displayMsp();
    });

    // Hide product page 
    $('div.quantity input').hide();
    $('p.price').hide();
    $('div.images').hide();

  } // end of displayManagedPlans


  /*
   *  ----------  Managed Service Plan -----------
   */
  function displayMsp() {

    var $input_msp = $('input[name="msp"]');
    var $btn_NextHos = $('#next-hos');
    var mspChecked;

    // call highLightMsp to check the box 
    highLightMsp();

    $('div.msp-container').show();  
    $btn_NextHos.removeClass('disabled');

    // mspSelected has two options
    // 'none' option 1,  and 'premium' option 2
    // the default is option 2
    $input_msp.on('click', function(e) {
      if ($input_msp.is('input:checked')) {
        mspChecked = 2;

        $select[1].each(function() {
            this.selectedIndex = mspChecked ;
        });

        $btn_NextHos.removeClass('disabled');
      } else {

        mspChecked = 1;
        $select[1].each(function() {
            this.selectedIndex = mspChecked ;
        });

        $btn_NextHos.removeClass('disabled');
      }
    }); // end of msp input checkbox handler

    // Navigation - Go back to Managed Plans page
    $('.msp-container nav a.back-btn').on('click', function(e) {
      e.preventDefault();
      $('div.data-plan-container').show();
      $('div.msp-container').hide();  
      $btn_NextHos.removeClass('disabled');
    });

    // Navigation - Go to Hours of Service page
    $btn_NextHos.on('click', function(e) {
      e.preventDefault();
      $.scrollTo( '#page', 0);
      $('div.summary.entry-summary').show();
      $('div.summary.entry-summary').css({"padding-top": "0"});
      $('div.msp-container').hide();
      $('.price-holder.price.single-text').hide();

      displayHos();
    });
   
  } // end of  displayMsp()

  /*
   * --------- Hours of Service ----------
   */
  function displayHos() {
    var $input_hos = $('input[name="hos"]');
    var hosCheckedNum;

    $button_submit.show();
    $('div.hos-container').show(); 
    $('#next-accessories').hide(); 

    // Make sure 'Next - Accessories' not disabled
    insertHref(true);
    highLightHos();

    //Checked box should not be a click event
    $input_hos.on('click', function(){
      var hosCheckedNum = $hos_select_box.find('option:selected').data('tag');

      if(hosCheckedNum <= 1){

        $input_hos.removeAttr('checked'); 

      } else {
        $input_hos.removeAttr('checked');

        // Change the hidden HOS select box here
        $select[2].each(function() {
          this.selectedIndex = 1;
        });

        /* Change the visible HOS select box here
         * Note there is not a 1:1 relationship because 
         * we have removed the none selection from the 
         * hidden Hours of Service selection box 
         */
        $hos_select_box.find('option:eq(0)').attr('selected','selected');
      }

    });

    // Grab data tag
    $hos_select_box.on('change', function(e) {
      hosCheckedNum = $(this).find('option:selected').data('tag');
      if (hosCheckedNum !== 1) {
        $input_hos.attr('checked', 'checked');

        // Change the hidden HOS select box here
        $select[2].each(function() {
          this.selectedIndex = hosCheckedNum;
        });

      } else {
        // Change the hidden HOS select box here        
        $select[2].each(function() {
          this.selectedIndex = hosCheckedNum;
        });

        $input_hos.removeAttr('checked');
      }
    });

    // Navigation - Go back to Managed Service Plan page
    $('.hos-container nav a.back-btn').on('click', function(e) {
      e.preventDefault();
      $button_submit.hide();
      $('div.hos-container').hide();
      $('div.summary.entry-summary').hide();
      $('div.msp-container').show();
    });

    /* Navigation to Accessories page and the
     * order placement is handled by the original
     * 'add-to-cart' button now renamed  
     * 'NEXT - Accessories' button
     */
 
  }  // END of displayHos()

 // Add Disabled to button or Remove disabled
  function insertHref(boxChecked) {
    if (boxChecked) {
      $button_submit.removeClass('disabled');
    }
    else {
      $button_submit.addClass('disabled');
    }
  }

  // Highlight and select the default selection
  function highLight() {
    var idx;
    $select[0].each(function() {
      idx = this.selectedIndex;

      // If no default selection
      // set default to first data plan
      if (idx === 0) { 
        idx = this.selectedIndex = 1;
      }

      // select a plan
      if (idx > 0) {
        $('.plans').filter(function() {
          return $(this).data('tag') === idx;
        }).addClass('active').find('input').attr('checked', 'checked')
          .parent().parent().siblings().removeClass('active')
          .find('input').removeAttr('checked');
      }
    });
    return idx > 0 ? true : false;    
  }

  function highLightMsp() {
    var idx;
    $('#next-hos').removeClass('disabled');
    $select[1].each(function() {
      idx = this.selectedIndex;

      // Production db workaround
      // we will always select "Premium"
      // so always re-assign idx to 2 "Premium"
      // even if not logged in.
      if ( !$('body').is( '.logged-in' ) ){
        this.selectedIndex = idx = 2;
      }   

      // select a MSP
      if (idx === 0 ) {
        // set to selection[1] 'none'
        this.selectedIndex = idx + 1;
      } else if (idx > 1) {
          $('#msp_1').find('input').attr('checked', 'checked');
      }
    });
  }

  function highLightHos() {
    var idx;
    $select[2].each(function() {
      idx = this.selectedIndex;
      insertHref(true);
      // if idx == 0 select HOS 'None'
      if (idx === 0) {
        this.selectedIndex = idx + 1;
      } else if (idx > 1) {
          $('#hos_1').find('input').attr('checked', 'checked');
      } 
    });    
  }

  $('.woocommerce-variation-add-to-cart').prepend('<p class="qty-text">quantity</p>');
  
  /*
   *************************************
   * Start the single page mini-app here 
   *************************************
   */ 
  pageInit();

})(jQuery, window, document); // end jquery func
