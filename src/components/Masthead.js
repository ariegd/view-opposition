class Masthead extends HTMLElement {
    constructor() {
        super();
    }

    static get styles() {
        return /*css*/ `  
        div.masthead {
            position: relative;
            background-color: #343a40;
            background: url("../assets/img/bg-masthead.jpg") no-repeat center center;
            background-size: cover;
            padding-top: 8rem;
            padding-bottom: 8rem;
          }
          div.masthead:before {
            content: "";
            position: absolute;
            background-color: #1c375e;
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            opacity: 0.5;
          }
          div.masthead h1, div.masthead .h1 {
            font-size: 2rem;
          }
          @media (min-width: 768px) {
            div.masthead {
              padding-top: 12rem;
              padding-bottom: 12rem;
            }
            div.masthead h1, div.masthead .h1 {
              font-size: 3rem;
            }
          }
          
        
        
          .showcase .showcase-text {
            padding: 3rem;
          }
          .showcase .showcase-img {
            min-height: 30rem;
            background-size: cover;
          }
          @media (min-width: 768px) {
            .showcase .showcase-text {
              padding: 7rem;
            }
          }
          
          .testimonials {
            padding-top: 7rem;
            padding-bottom: 7rem;
          }
          .testimonials .testimonial-item {
            max-width: 18rem;
          }
          .testimonials .testimonial-item img {
            max-width: 12rem;
            box-shadow: 0px 5px 5px 0px #adb5bd;
          }
          
          .call-to-action {
            position: relative;
            background-color: #343a40;
            background: url("../src/assets/img/bg-masthead.jpg") no-repeat center center;
            background-size: cover;
            padding-top: 7rem;
            padding-bottom: 7rem;
          }
          .call-to-action:before {
            content: "";
            position: absolute;
            background-color: #1c375e;
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            opacity: 0.5;
          }
        `;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = /*html*/ `
        <style>${Masthead.styles}</style>
            <!-- Masthead-->
            <div class="masthead">
                <div class="container position-relative">
                    <div class="row justify-content-center">
                        <div class="col-xl-6">
                            <div class="text-center text-white">
                                <!-- Page heading-->
                                <h1 class="mb-5">Generate more leads with a professional landing page!</h1>
                                <!-- Signup form-->
                                <!-- * * * * * * * * * * * * * * *-->
                                <!-- * * SB Forms Contact Form * *-->
                                <!-- * * * * * * * * * * * * * * *-->
                                <!-- This form is pre-integrated with SB Forms.-->
                                <!-- To make this form functional, sign up at-->
                                <!-- https://startbootstrap.com/solution/contact-forms-->
                                <!-- to get an API token!-->
                                <form class="form-subscribe" id="contactForm" data-sb-form-api-token="API_TOKEN">
                                    <!-- Email address input-->
                                    <div class="row">
                                        <div class="col">
                                            <input class="form-control form-control-lg" id="emailAddress" type="email" placeholder="Email Address" data-sb-validations="required,email" />
                                            <div class="invalid-feedback text-white" data-sb-feedback="emailAddress:required">Email Address is required.</div>
                                            <div class="invalid-feedback text-white" data-sb-feedback="emailAddress:email">Email Address Email is not valid.</div>
                                        </div>
                                        <div class="col-auto"><button class="btn btn-primary btn-lg disabled" id="submitButton" type="submit">Submit</button></div>
                                    </div>
                                    <!-- Submit success message-->
                                    <!---->
                                    <!-- This is what your users will see when the form-->
                                    <!-- has successfully submitted-->
                                    <div class="d-none" id="submitSuccessMessage">
                                        <div class="text-center mb-3">
                                            <div class="fw-bolder">Form submission successful!</div>
                                            <p>To activate this form, sign up at</p>
                                            <a class="text-white" href="https://startbootstrap.com/solution/contact-forms">https://startbootstrap.com/solution/contact-forms</a>
                                        </div>
                                    </div>
                                    <!-- Submit error message-->
                                    <!---->
                                    <!-- This is what your users will see when there is-->
                                    <!-- an error submitting the form-->
                                    <div class="d-none" id="submitErrorMessage"><div class="text-center text-danger mb-3">Error sending message!</div></div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define("tag-mast", Masthead);