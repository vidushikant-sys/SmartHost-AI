from flask import jsonify
from werkzeug.exceptions import HTTPException


def register_error_handlers(app):
    """
    Register Global Error Handlers
    """

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "success": False,
            "message": "Bad request."
        }), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({
            "success": False,
            "message": "Unauthorized access."
        }), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({
            "success": False,
            "message": "Permission denied."
        }), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "message": "Resource not found."
        }), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({
            "success": False,
            "message": "Method not allowed."
        }), 405

    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        return jsonify({
            "success": False,
            "message": error.description
        }), error.code

    @app.errorhandler(Exception)
    def internal_server_error(error):
        print("GLOBAL ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Internal server error."
        }), 500