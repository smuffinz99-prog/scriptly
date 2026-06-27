/* Scriptly — Stripe Checkout
 * Pro plan: $6/month
 * Replace the URL below with your Stripe Payment Link.
 * Create at: dashboard.stripe.com → Payment Links → + New
 * Set post-payment redirect to: https://smuffinz99-prog.github.io/scriptly/app.html?pro=success
 */
(function(){
  var MONTHLY_LINK = '';  // paste Stripe Payment Link here

  window.SCRIPTLY_CHECKOUT = function(){
    if (!MONTHLY_LINK){
      alert('Stripe not yet configured.\n\n1. Go to dashboard.stripe.com\n2. Create a product: "Scriptly Pro" at $9/month\n3. Create a Payment Link, set redirect to app.html?pro=success\n4. Paste the URL into pricing.js');
      return;
    }
    window.location.href = MONTHLY_LINK;
  };
})();
