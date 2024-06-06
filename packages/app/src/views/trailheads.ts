import { LitElement, css, html } from "lit";
import { regions } from "../regions";
export class Trailheads extends LitElement {

    static styles = css`
        a {
            color: var(--color-text);
            text-decoration: none;
        }

        .cardContainer {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
        }

        .card {
            background-color: var(--color-background-card);
            padding: 15px;
            border-radius: 5px;
            border-color: grey;
            border-width: 1px;
        }

        .card:hover {
            box-shadow: 0 0 10px 0 var(--color-primary);
        }

        .search {
            padding: 10px;
            border-radius: 5px;
            border-color: grey;
        }
    `

    handleSearch(e: Event) {
        const search = (e.target as HTMLInputElement).value.toLowerCase();
        const cards = this.shadowRoot?.querySelectorAll('.card') as NodeListOf<HTMLElement>;

        cards.forEach(card => {
            if (card.innerText.toLowerCase().includes(search)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    render() {
        return html`
            <h1>Trailheads</h1>
            <input class="search" type="text" id="search" placeholder="Search for a trailhead" @input=${this.handleSearch}>

            ${Object.keys(regions).map(region => {
            return html`
                    <h2>${regions[region].region_name}</h2>
                    <div class="cardContainer">
                        ${Object.keys(regions[region].trailheads).map(trailhead => {
                return html`
                                <div class="card">
                                    <a href='/app/request/${trailhead}'>
                                        ${regions[region].trailheads[trailhead]}
                                    </a>
                                </div>
                            `
            })
                }
                    </div>
                    `
        })
            }
        `;
    }
}