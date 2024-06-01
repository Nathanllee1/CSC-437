import { LitElement, css, html } from "lit";


export class Hero extends LitElement {

    render() {
        return html`
        <div class="hero">
            <div class="hero_content">
                <h1>Permit Tracker</h1>
                <div>Get notified via SMS when <a href="https://recreation.gov" target="_blank">recreation.gov</a>
                    permits
                    become available</div>
                <br>
                <a href="campsites.html">Get started today</a>
            </div>

            <img class="hero_img" src="/assets/mountain.jpeg" alt="mountain" width="400px" />
        </div>
        `
    }

    static styles = css`
        .hero {
            display: flex;
            justify-content: center;
            flex-wrap:wrap;
            gap: 30px;
            margin-top: 6em;
        }
        
        .hero img {
            border-radius: 4%;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        }
        
        .hero_content {
            align-self: center;
        }

    `

}