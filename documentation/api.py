from fpdf import FPDF, XPos, YPos

# Création du PDF
pdf = FPDF()
pdf.set_auto_page_break(auto=True, margin=15)
pdf.add_page()

# Ajouter les polices (sans le paramètre uni obsolète)
pdf.add_font('DejaVu', '', 'DejaVuSans.ttf')
pdf.add_font('DejaVu', 'B', 'DejaVuSans-Bold.ttf')
pdf.add_font('NotoEmoji', '', 'NotoColorEmoji.ttf')

def write_emoji_text(text, font_size=14):
    """Écrit un texte qui peut contenir des emojis en alternant les polices"""
    pdf.set_font("DejaVu", "", font_size)
    temp_text = ""
    for char in text:
        # Vérifie si le caractère est un emoji (plage étendue)
        if (0x1F600 <= ord(char) <= 0x1F64F or  # Emoticons
           0x1F300 <= ord(char) <= 0x1F5FF or  # Symboles & pictogrammes
           0x1F680 <= ord(char) <= 0x1F6FF or  # Transport & symboles
           0x2600 <= ord(char) <= 0x26FF or    # Symboles divers
           0x2700 <= ord(char) <= 0x27BF or    # Dingbats
           0x1F900 <= ord(char) <= 0x1F9FF) or char == "🩺":   # Emojis supplémentaires
            if temp_text:
                pdf.cell(pdf.get_string_width(temp_text), 10, temp_text)
                temp_text = ""
            pdf.set_font("NotoEmoji", "", font_size)
            pdf.cell(10, 10, char)  # Largeur fixe pour emoji
            pdf.set_font("DejaVu", "", font_size)
        else:
            temp_text += char
    if temp_text:
        pdf.cell(pdf.get_string_width(temp_text), 10, temp_text)
    pdf.ln(10)

def add_route_section(title, routes):
    # Vérifier l'espace disponible
    if pdf.get_y() + 10 + len(routes)*10 + 20 > pdf.h - 15:
        pdf.add_page()

    # Écrire le titre
    pdf.set_x(10)
    write_emoji_text(title, 14)

    # En-têtes du tableau (avec nouvelle syntaxe)
    col_widths = [30, 70, 60, 30]
    pdf.set_font("DejaVu", "B", 12)
    pdf.cell(col_widths[0], 10, "Méthode", border=1)
    pdf.cell(col_widths[1], 10, "Route", border=1)
    pdf.cell(col_widths[2], 10, "Description", border=1)
    pdf.cell(col_widths[3], 10, "Auth", border=1, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # Contenu des routes
    pdf.set_font("DejaVu", "", 12)
    for method, route, desc, auth in routes:
        if pdf.get_y() + 10 > pdf.h - 15:
            pdf.add_page()
            # Réécrire les en-têtes si nouvelle page
            pdf.set_font("DejaVu", "B", 12)
            pdf.cell(col_widths[0], 10, "Méthode", border=1)
            pdf.cell(col_widths[1], 10, "Route", border=1)
            pdf.cell(col_widths[2], 10, "Description", border=1)
            pdf.cell(col_widths[3], 10, "Auth", border=1, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            pdf.set_font("DejaVu", "", 12)

        pdf.cell(col_widths[0], 10, method, border=1)
        pdf.cell(col_widths[1], 10, route, border=1)
        pdf.cell(col_widths[2], 10, desc, border=1)
        pdf.set_font("NotoEmoji", "", 12)
        emoji_auth = "✅" if auth else "❌"
        pdf.cell(col_widths[3], 10, emoji_auth, border=1, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_font("DejaVu", "", 12)
    pdf.ln(5)

# Titre principal (avec nouvelle syntaxe)
pdf.set_font('DejaVu', '', 12)
pdf.cell(0, 10, "Tableau des routes API REST - Projet Save My Data", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')
pdf.ln(10)

# Données des routes
routes_data = {
    "🔐 Authentification": [
        ("POST", "/api/auth/register", "Créer un compte utilisateur", False),
        ("POST", "/api/auth/login", "Connexion (JWT)", False),
        ("POST", "/api/auth/logout", "Déconnexion", True),
        ("GET", "/api/auth/me", "Infos utilisateur connecté", True),
    ],
    "👤 Utilisateurs": [
        ("GET", "/api/users/:id", "Récupérer un utilisateur", True),
        ("PUT", "/api/users/:id", "Modifier un utilisateur", True),
        ("DELETE", "/api/users/:id", "Supprimer un utilisateur", True),
    ],
    "📂 Fichiers": [
        ("GET", "/api/files", "Lister les fichiers", True),
        ("POST", "/api/files", "Uploader un fichier", True),
        ("GET", "/api/files/:id", "Télécharger un fichier", True),
        ("DELETE", "/api/files/:id", "Supprimer un fichier", True),
    ],
    "🗂️ Catégories (optionnel)": [
        ("GET", "/api/categories", "Lister les catégories", True),
        ("POST", "/api/categories", "Créer une catégorie", True),
        ("DELETE", "/api/categories/:id", "Supprimer une catégorie", True),
    ],
    "🩺 Healthcheck": [
        ("GET", "/api/health", "Tester si l'API fonctionne", False),
    ]
}

# Génération des sections
for title, routes_list in routes_data.items():
    add_route_section(title, routes_list)

# Sauvegarde
pdf.output("api.pdf")

# Nettoyage des dépendances (à exécuter dans le terminal)
print("\n\n⚠️ Pour éviter les conflits, exécutez cette commande :")
print("pip uninstall --yes pypdf && pip install --upgrade fpdf2")