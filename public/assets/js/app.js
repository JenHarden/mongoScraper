// Ensures that the DOM is ready before executing any JavaScript
$(function () {

    // Function to delete all the articles
    function clear() {
        $("#well-section").empty();
    }

    // Run a scrape and display the results
    $("#scrape-btn").on("click", function () {

        // Keep the page from reloading
        event.preventDefault();

        // Empty the articles section
        clear();

        // Run the scaping route
        $.ajax("/scrape", {
            type: "GET",
            function() {
                $('#scrapeModal').modal('show');
            }
        }).then(function () {

            // Reload the page to get the scraped data
            $(".scrapeCloseBtn").on("click", function () {
                window.location.href = '/';
            });
        });
    });

    $(document).on("click", "#clear-btn", function () {

        // Keep the page from reloading
        event.preventDefault();

        // Summon the warning modal to prevent accidental database drop
        $('#warningModal').modal('show');
    });

    // Clear the scraped results
    $("#destroy-btn").on("click", function () {

        // Keep the page from reloading
        event.preventDefault();

        // Need to place reload here or it won't fire
        location.reload();

        $.ajax({
            type: 'DELETE',
            url: '/drop-articles',
            success: function (response) {
                if (response == 'error') {
                    console.log('Err!');
                }
            }
        });
    });

    // Save an Article
    $(".save-btn").on("click", function () {

        // Keep the page from reloading
        event.preventDefault();

        // Read data attribute from save button
        var id = $(this).data("id");

        // Send the PUT request
        $.ajax({
            url: "/saved/" + id,
            type: "PUT",
            success: function () {

                // Show the save success modal
                $('#saveArticleModal').modal('show');
            }
        })

            // Update the page once the modal is closed
            .then(function () {
                $(".saveArticleCloseBtn").on("click", function () {
                    window.location.href = '/';
                });
            });
    });

    // Get all notes for an article
    $(".notes-btn").on("click", function () {

        // Keep the page from reloading
        event.preventDefault();

        // Empty the notes from the note section
        $(".noteArea").empty();

        // Save the id from the button
        var articleId = $(this).attr("data-id");

        // Make the ajax call for the article
        $.ajax({
            method: "GET",
            url: "/getnotes/" + articleId,
            success: function () {

                // Open the notes modal
                $('#notesModal').modal('show');
            }
        })

            // Add the note information
            .then(function (data) {
                var id = data._id;

                // Set the title in the header
                $(".modal-title").html(data.title);

                // Create a data-id attribute for the button
                $(".saveNoteBtn").attr("data-id", id);

                // If there's already a note for the article
                if (data.notes) {
                    console.log(data.notes);
                    for (i = 0; i < data.notes.length; i++) {
                        $(".noteArea").append(
                            "<div class='card-body notecard' id='notecard'>" +
                            "<h4 class='notecardTitle' data-id='" + data.notes[i]._id + "'>" +
                            data.notes[i].title +
                            "</h4>" +
                            "<button type='button' class='btn btn-danger deleteNote' data-id='" + data.notes[i]._id + "'>Delete</button>" +
                            "</div>"
                        );
                        $(".noteArea").append(
                            "<hr>"
                        );
                    }
                }
            });
    });

    // Retrieve a specific Note
    $(document).on("click", ".notecardTitle", function () {
        var noteId = $(this).attr("data-id");
        console.log("noteId by title: " + noteId);

        // Run a GET request to update the note
        $.ajax({
            method: "GET",
            url: "/getsinglenote/" + noteId
        })
            .then(function (data) {

                // Log the response
                console.log(data);
                if (data) {

                    // If note found, place the title and body of note
                    $("#titleinput").val(data.title);
                    $("#bodyinput").val(data.body);
                }
            })
    });

    // Delete a specific Note
    $(document).on("click", ".deleteNote", function () {
        var noteId = $(this).attr("data-id");
        console.log("noteId: " + noteId);

        // Run a POST request to delete the note
        $.ajax({
            method: "DELETE",
            url: "/deletenote/" + noteId
        })
            .then(function (data) {

                // Log the response
                console.log(data);
                window.location.href = '/saved-articles';
            })
    });

    // Save a Note
    $(".saveNoteBtn").on("click", function () {
        var articleId = $(this).attr("data-id");
        $.ajax({
            url: "/postnotes/" + articleId,
            method: "POST",
            data: {

                // Value taken from title input and note textarea
                title: $("#titleinput").val(),
                body: $("#bodyinput").val()
            }
        })
            .then(function (data) {
                window.location.href = '/saved-articles';
            });

        // Remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
    });


    // Unsave an Article
    $(".return-btn").on("click", function () {

        // Keep the page from reloading
        event.preventDefault();

        // Read data attribute from "return" button
        var id = $(this).data("id");

        // Send the PUT request
        $.ajax({
            url: "/returned/" + id,
            type: "PUT",
            success: function () {

                // Show the unsave success message in the modal
                $('#returnArticleModal').modal('show');
            }
        })

            // Update the page once the modal is closed
            .then(function () {
                $(".returnArticleCloseBtn").on("click", function () {
                    window.location.href = '/saved-articles';
                });
            });
    });
})